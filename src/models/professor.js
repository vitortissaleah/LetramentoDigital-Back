const mongoose = require("mongoose");

const ProfessorSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    cpf: { type: String, required: true, unique: true },
    curso: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cursos",  // Um professor ministra aula em um curso ( 1 pra 1 )
      unique: true,
    },                
  },
  { timestamps: true }
);

module.exports = mongoose.model("Professor", ProfessorSchema);