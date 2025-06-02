const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/protected", authMiddleware, (req, res) => {
    res.json({ message: "Acesso autorizado!", user: req.user });
});

module.exports = router;
