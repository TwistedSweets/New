// Importa cliente Prisma generado en la migración.
const { PrismaClient } = require('../generated/prisma');

// Crea una instancia de PrismaClient para interactuar con la base de datos.
const prisma = new PrismaClient();

// Exporta la instancia de Prisma para usarla en otras partes de la aplicación.
module.exports = prisma;