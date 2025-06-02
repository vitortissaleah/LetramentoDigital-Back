const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    cpf: { type: String, required: true, unique: true },
    cursosGerenciados: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cursos", // Um Admin pode gerenciar vários cursos 
      },               // 1 para Muitos
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", AdminSchema);