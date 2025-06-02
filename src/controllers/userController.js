const Aluno = require("../models/aluno");
const Professor = require("../models/professor");
const Admin = require("../models/admin");

exports.getUsersByType = async (req, res) => {
  try {
    const { tipo } = req.params;

    let users;
    if (tipo === "Aluno") {
      users = await Aluno.find().populate("cursos", "nome").lean();
    } else if (tipo === "Professor") {
      users = await Professor.find().populate("curso", "nome").lean();
    } else if (tipo === "Admin") {
      users = await Admin.find().lean();
    } else {
      return res.status(400).json({ message: "Tipo de usuário inválido" });
    }

    const formattedUsers = users.map((user) => ({
      ...user,
      tipo: tipo,
    }));

    res.status(200).json({ users: formattedUsers });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;

    let newUser;
    if (tipo === "Aluno") {
      newUser = new Aluno({ nome, email, senha });
    } else if (tipo === "Professor") {
      newUser = new Professor({ nome, email, senha });
    } else if (tipo === "Admin") {
      newUser = new Admin({ nome, email, senha });
    } else {
      return res.status(400).json({ message: "Tipo de usuário inválido" });
    }

    await newUser.save();
    res.status(201).json({ message: "Usuário criado com sucesso" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const aluno = await Aluno.findById(id);
    const professor = await Professor.findById(id);
    const admin = await Admin.findById(id);

    let updatedUser;
    if (aluno) {
      updatedUser = await Aluno.findByIdAndUpdate(id, req.body, { new: true });
    } else if (professor) {
      updatedUser = await Professor.findByIdAndUpdate(id, req.body, {
        new: true,
      });
    } else if (admin) {
      updatedUser = await Admin.findByIdAndUpdate(id, req.body, { new: true });
    } else {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res
      .status(200)
      .json({ message: "Usuário atualizado com sucesso", user: updatedUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const aluno = await Aluno.findByIdAndDelete(id);
    const professor = await Professor.findByIdAndDelete(id);
    const admin = await Admin.findByIdAndDelete(id);

    if (!aluno && !professor && !admin) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const aluno = await Aluno.findById(id).populate("cursos", "nome");
    const professor = await Professor.findById(id).populate("cursos", "nome");
    const admin = await Admin.findById(id);

    if (aluno) {
      return res
        .status(200)
        .json({ message: "Usuário encontrado com sucesso", user: aluno });
    } else if (professor) {
      return res
        .status(200)
        .json({ message: "Usuário encontrado com sucesso", user: professor });
    } else if (admin) {
      return res
        .status(200)
        .json({ message: "Usuário encontrado com sucesso", user: admin });
    } else {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
  } catch (error) {
    res.status(400).json({ message: "Erro ao buscar usuário" });
  }
};
