const prisma = require("../config/db");
const multer = require("multer");
const path = require("path");

//Get usuario por ID (ejemplo de ruta protegida).
const getUserById = async (req, res) => {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
        return res.status(400).json({ error: "ID de usuario inválido" });
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, username: true, bio: true, avatarUrl: true } // Seleccionamos solo los campos que queremos devolver.
    });

    if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ user });
}

const updateProfile = async (req, res) => {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
        return res.status(400).json({ error: "ID de usuario inválido" });
    }

    // Solo el mismo usuario autenticado puede actualizar su perfil.
    if (req.user.id !== userId) {
        return res.status(403).json({ error: "No tienes permiso para actualizar este perfil" });
    }

    const { username, bio, avatarUrl } = req.body;

    // Verificar si el nuevo username ya está en uso por otro usuario.
    if (username) {
        const existing = await prisma.user.findFirst({
            where: {
                username,
                NOT: { id: userId } // Excluir al usuario actual de la búsqueda.
            }
        });
        if (existing) {
            return res.status(400).json({ error: "El username ya está en uso por otro usuario" });
        }
    }

    // Actualizar el perfil del usuario en la base de datos.
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            // ...(condicion && { campo: valor }) es una forma de incluir un campo en el objeto solo si la condición es verdadera.
            // De esta manera, solo actualizamos los campos que fueron proporcionados en la solicitud.
            ...(username !== undefined && { username }),
            ...(bio !== undefined && { bio }),
            ...(avatarUrl !== undefined && { avatarUrl })
        },
        select: { id: true, email: true, username: true, bio: true, avatarUrl: true } // Seleccionamos solo los campos que queremos devolver.
    });
    res.json({ message: "Perfil actualizado correctamente", user: updatedUser });
}

//Multer corre Antes de la funcion  (como Middlware en la ruta).
const uploadAvatar = async (req, res) => {
    const userId = parseInt(req.params.id);

    if (req.user.id !== userId) {
        return res.status(403).json({ error: "No tienes permiso para actualizar este perfil" });
    }

    if (!req.file) {
        return res.status(400).json({ error: "No se ha subido ningún archivo" });
    }

    const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { avatarUrl },
        select: { id: true, email: true, username: true, bio: true, avatarUrl: true }
    });

    res.json({ message: "Avatar actualizado correctamente", user: updatedUser });
};

module.exports = {
    getUserById,
    updateProfile,
    uploadAvatar
};