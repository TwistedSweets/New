//Proteje contraseñas, que incluso si la base de datos es comprometida, las contraseñas no sean expuestas en texto plano. bcrypt es una biblioteca de hashing de contraseñas que utiliza un algoritmo de hashing adaptativo, lo que significa que el tiempo necesario para calcular el hash aumenta con el tiempo, lo que hace que sea más difícil para los atacantes realizar ataques de fuerza bruta.
const bcrypt = require("bcrypt");
//JWT Tokens crea y verefica tokens de autentificación despues de un login exitoso.
const jwt = require("jsonwebtoken");
//La conexión a la base de datos xD, que me deja modificar y leer las 5 tablas que tengo en la base de datos.
const prisma = require("../config/db");

// Constante funcion de autenticación: maneja el registro, login y logout de usuarios.
const register = async (req, res) => {
    const { email, username, password } = req.body;

    // Validación básica de entrada.
    if (!email || !username || !password) {
        return res.status(400).json({ error: "El email, username y password son requeridos" });
    }

    //Contraseña debe tener al menos 8 caracteres, incluir al menos una mayúscula, minúscula, número y caracter especial.
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(409).json({ error: "La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales" });
    }

    // Verificar si el email o username ya existe en la base de datos.
    const existing = await prisma.user.findFirst({
        where: {
            OR: [
                { email },
                { username }
            ]
        }
    });

    // Si ya existe un usuario con el mismo email o username, respondemos con un error 400.
    if (existing) {
        return res.status(400).json({ error: "El email o username ya está en uso" });
    }

    // Hashear la contraseña antes de guardarla en la base de datos.
    const passwordHash = await bcrypt.hash(password, 12);

    // Crear el nuevo usuario en la base de datos con el email, username y contraseña hasheada.
    const user = await prisma.user.create({
        data: {
            email,
            username,
            passwordHash
        }
    });

    // Respondemos con un mensaje de éxito.
    res.status(201).json({ message: "Usuario registrado exitosamente",
        user: {
            id: user.id,
            email: user.email,
            username: user.username
        }
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    // Validación básica de entrada.
    if (!email || !password) {
        return res.status(400).json({ error: "El email y password son requeridos" });
    }

    // Buscar el usuario por email en la base de datos.
    const user = await prisma.user.findUnique({ where: { email } });
    // Si no se encuentra el usuario, respondemos con un error 401.
    if (!user) {
        return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Verificar la contraseña.
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Generar un token JWT.
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "15m" });

    // Generar refresh token JWT para renovar el token de acceso sin necesidad de volver a loguear.
    const refreshToken = require("crypto").randomBytes(64).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Expira en 7 días

    // Guardar el refresh token en la base de datos asociado al usuario.
    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt
        }
    });

    //Enviar refresh token como cookie segura (httpOnly = JS no puede leerla).
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Solo enviar cookie segura en producción
        sameSite: "strict", // Evitar que la cookie se envíe en solicitudes cross-site
        maxAge: 7 * 24 * 60 * 60 * 1000 // Expira en 7 días
    });

    // Respondemos con el token y la información del usuario.
    res.status(200).json({ message: "Login exitoso", token, user: { id: user.id, email: user.email, username: user.username } });
};

const logout = async (req, res) => {
    const token = req.cookies?.refreshToken;
    if (token) {
        // Eliminar el refresh token de la base de datos para invalidarlo.
        await prisma.refreshToken.deleteMany({ where: { token } });
    }

    res.clearCookie("refreshToken"); // Limpiar la cookie del refresh token en el cliente.
    res.json({ message: "Logout exitoso" });
};

module.exports = {
    register,
    login,
    logout
};