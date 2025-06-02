const Cursos = require("../models/cursos");
const Professor = require("../models/professor");
const Aluno = require("../models/aluno");

exports.createCursos = async (req, res) => {
  try {
    const { professorId, ...cursoData } = req.body;

    // Verifica se o professor já existe
    const professor = await Professor.findById(professorId);
    if (!professor) {
      return res.status(400).json({ message: "Professor inválido" });
    }

    // Verifica se o professor já está vinculado a um curso
    if (professor.curso) {
      return res
        .status(400)
        .json({ message: "Este professor já está vinculado a outro curso" });
    }

    const curso = new Cursos({
      ...cursoData,
      professor: professorId,
    });

    await curso.save();

    // Associa o curso ao professor
    professor.curso = curso._id;
    await professor.save();

    res.status(201).json({ message: "Curso criado com sucesso", curso });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Matricula um aluno em um curso
exports.matricularAluno = async (req, res) => {
  try {
    const { cursoId, alunoId } = req.body;

    // Verifica se o curso existe
    const curso = await Cursos.findById(cursoId);
    if (!curso) {
      return res.status(400).json({ message: "Curso não encontrado" });
    }

    // Verifica se o aluno existe
    const aluno = await Aluno.findById(alunoId);
    if (!aluno) {
      return res.status(400).json({ message: "Aluno inválido" });
    }

    // Verifica se o aluno já está matriculado no curso
    if (curso.aluno.includes(alunoId)) {
      return res
        .status(400)
        .json({ message: "Aluno já está matriculado neste curso" });
    }

    // Matricula o aluno no curso
    curso.aluno.push(alunoId);
    aluno.cursos.push(cursoId);

    await curso.save();
    await aluno.save();

    res.status(200).json({ message: "Aluno matriculado com sucesso" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllCursos = async (req, res) => {
  try {
    const cursos = await Cursos.find()
      .populate("professor", "nome email")
      .populate("admin", "nome email");

    res.status(200).json(cursos);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getCursoById = async (req, res) => {
  try {
    const cursoId = req.params.id;

    // Busca o curso pelo ID e mostra os alunos e os professores ( populate )
    const curso = await Cursos.findById(cursoId)
      .populate("professor", "nome email") // Retorna as informações do professor
      .populate("aluno", "nome email"); // Retorna as informações dos alunos

    if (!curso) {
      return res.status(404).json({ message: "Curso não encontrado" });
    }

    res.status(200).json(curso);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateCursos = async (req, res) => {
  try {
    const curso = await Cursos.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!curso) {
      return res.status(404).json({ message: "Curso não encontrado" });
    }
    res.status(200).json(curso);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteCursos = async (req, res) => {
  try {
    const curso = await Cursos.findByIdAndDelete(req.params.id);
    if (!curso) {
      return res.status(404).json({ message: "Curso não encontrado" });
    }

    // Remover referências do curso nos professores
    await Professor.updateMany(
      { cursos: curso._id },
      { $pull: { cursos: curso._id } }
    );

    // Remover referências do curso nos alunos
    await Aluno.updateMany(
      { cursos: curso._id },
      { $pull: { cursos: curso._id } }
    );

    res.status(200).json({ message: "Curso deletado com sucesso" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
