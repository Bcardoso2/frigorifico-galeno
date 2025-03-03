const express = require("express");
const router = express.Router();
const { getCortesPorProduto } = require("../controllers/corteController");

// 🔹 Rota para buscar cortes de um produto específico
router.get("/parte/:id", getCortesPorProduto);

router.get("/", getCortes);


module.exports = router;
