const mongoose = require("mongoose");

const AlunoSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    cpf: { type: String, required: true, unique: true },
    cursos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cursos", // Um Aluno pode estar matriculado em mais de um curso
      },               // Muitos pra Muitos
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Aluno", AlunoSchema);
