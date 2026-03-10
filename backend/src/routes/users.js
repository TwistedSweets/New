const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");
const { protect } = require("../middleware/auth.middleware");

// Rutas de usuarios
router.get("/:id", protect, usersController.getUserById);
router.put("/:id", protect, usersController.updateProfile);

module.exports = router;