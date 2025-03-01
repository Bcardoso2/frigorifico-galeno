const express = require("express");
const Produto = require("../models/Produto");

const router = express.Router();

// 🔹 Listar todos os produtos (partes principais: Traseiro, Dianteiro, P.A.)
router.get("/", async (req, res) => {
  try {
    const produtos = await Produto.findAll();
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar produtos", error });
  }
});



module.exports = router;