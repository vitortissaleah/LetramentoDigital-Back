const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cursosRoutes = require("./src/routes/cursosRoutes");
const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");
require("./src/config/database");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/cursos", cursosRoutes);

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
