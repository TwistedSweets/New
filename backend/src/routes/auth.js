const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");
const { message } = require("../config/db");

// Rutas de autenticación
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", protect, (req, res)=> {
    res.json({ message: "Ruta protegida, usuario autenticado", user: req.user });
});

module.exports = router;