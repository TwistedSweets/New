const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");
const { protect } = require("../middleware/auth.middleware");
const { upload } = require("../config/multer");

// Rutas de usuarios
router.get("/:id", protect, usersController.getUserById);
router.put("/:id", protect, usersController.updateProfile);
router.post("/:id/avatar", protect, upload.single("avatar"), usersController.uploadAvatar);

module.exports = router;