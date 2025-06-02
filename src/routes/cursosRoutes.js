const express = require("express");
const router = express.Router();
const cursosController = require("../controllers/cursosController");

router.post("/", cursosController.createCursos);
router.post("/matricular", cursosController.matricularAluno); // Matricula um alunos a um curso
router.get("/:id", cursosController.getCursoById); // Retorna detalhes do curso (mostrando professores e alunos)
router.get("/", cursosController.getAllCursos);
router.put("/:id", cursosController.updateCursos);
router.delete("/:id", cursosController.deleteCursos);

module.exports = router;