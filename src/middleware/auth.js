const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Acesso negado" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Armazena informações do usuário no objeto de requisição
    next();
  } catch (error) {
    res.status(400).json({ message: "Token inválido" });
  }
};
