const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/tipo/:tipo", userController.getUsersByType);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.get("/:id", userController.getUserById);

module.exports = router;    