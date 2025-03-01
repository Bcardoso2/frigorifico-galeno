const express = require("express");
const router = express.Router();
const { getEstoqueVendas } = require("../controllers/estoqueVendasController");

// 🔹 Rota para buscar os cortes disponíveis para venda
router.get("/", getEstoqueVendas);

module.exports = router;
