const express = require("express");
const router = express.Router();
const { getCortesPorProduto, getCortes } = require("../controllers/corteController"); // ✅ Inclui getCortes

// 🔹 Rota para buscar cortes de um produto específico
router.get("/parte/:id", getCortesPorProduto);

// 🔹 Rota para buscar todos os cortes com nome do produto e preço por kg
router.get("/", getCortes);

module.exports = router;
