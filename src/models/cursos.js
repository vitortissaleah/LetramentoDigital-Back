const mongoose = require("mongoose");

const CursosSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    descrição: { type: String, required: true },
    preço: { type: Number, required: true, min: 0 }, // Preço deve ser positivo
    imagem: { type: String, required: false },
    video: { type: String, required: false },
    promoção: { type: Number, required: true, min: 0 }, 
    professor:
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Professor", // Um curso pode ser ministrado por um professor
      },                  // 1 pra 1
    aluno: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Aluno", // Um curso pode ter vários alunos
      },              // 1 pra Muitos
    ],
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", // Um curso é gerenciado por apenas um admin
    },              // Muitos pra 1
    
  },

  { timestamps: true }
);

module.exports = mongoose.model("Cursos", CursosSchema);
