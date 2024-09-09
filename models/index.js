// const { PrismaClient } = require('@prisma/client')
// const prisma = new PrismaClient()

module.exports = new (require("@prisma/client").PrismaClient)();

// ลองทำให้เหลือ 1 statement (บรรทัดเดียว)
