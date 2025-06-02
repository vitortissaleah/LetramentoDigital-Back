const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Aluno = require("../models/aluno");
const Professor = require("../models/professor");
const Admin = require("../models/admin");

exports.register = async (req, res) => {
  const { nome, email, cpf, senha, tipo } = req.body;

  // Validar campos obrigatórios
  if (!nome || !email || !cpf || !senha || !tipo) {
    return res
      .status(400)
      .json({ message: "Por favor, preencha todos os campos." });
  }

  try {
    const existingCPFAluno = await Aluno.findOne({ cpf });
    const existingCPFProfessor = await Professor.findOne({ cpf });
    const existingCPFAdmin = await Admin.findOne({ cpf });

    if (existingCPFAluno || existingCPFProfessor || existingCPFAdmin) {
      return res.status(400).json({ message: "CPF já cadastrado." });
    }

    // Verificar se o tipo de usuário é válido
    let UserModel;
    switch (tipo) {
      case "Aluno":
        UserModel = Aluno;
        break;
      case "Professor":
        UserModel = Professor;
        break;
      case "Admin":
        UserModel = Admin;
        break;
      default:
        return res.status(400).json({ message: "Tipo de usuário inválido" });
    }

    // Verificar se o usuário já existe (por nome ou email)
    const existingUserByName = await UserModel.findOne({ nome });
    if (existingUserByName) {
      return res
        .status(400)
        .json({ message: "Nome de usuário já cadastrado." });
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ message: "Email já cadastrado." });
    }

    // Criptografar a senha
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(senha, salt);

    // Criar novo usuário
    const newUser = new UserModel({
      nome,
      email,
      cpf,
      senha: hashedPassword,
    });

    // Salvar no banco de dados
    await newUser.save();

    res.status(201).json({ message: "Cadastro realizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

exports.login = async (req, res) => {
  const { nome, senha, tipo } = req.body;

  // Validar campos obrigatórios
  if (!nome || !senha || !tipo) {
    return res
      .status(400)
      .json({ message: "Por favor, preencha todos os campos." });
  }

  try {
    let UserModel;
    switch (tipo) {
      case "Aluno":
        UserModel = Aluno;
        break;
      case "Professor":
        UserModel = Professor;
        break;
      case "Admin":
        UserModel = Admin;
        break;
      default:
        return res.status(400).json({ message: "Tipo de usuário inválido" });
    }

    // Buscar usuário pelo nome
    const user = await UserModel.findOne({ nome });

    if (!user) {
      return res.status(400).json({ message: "Usuário não encontrado" });
    }

    // Verificar senha
    const isMatch = await bcryptjs.compare(senha, user.senha);
    if (!isMatch) {
      return res.status(400).json({ message: "Senha incorreta" });
    }

    // Gerar token JWT
    const token = jwt.sign({ _id: user._id, role: tipo }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, userId: user._id, role: tipo });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};
