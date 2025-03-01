const express = require("express");
const Producao = require("../models/Producao");
const {finalizarProducao} = require("../controllers/producaoController");

const router = express.Router();

// 🔹 Cadastrar produção
router.post("/", async (req, res) => {
  try {
    const { produto_id, corte_id, kg_produzido } = req.body;

    if (!produto_id || !corte_id || !kg_produzido) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    const producao = await Producao.create({ produto_id, corte_id, kg_produzido });
    res.status(201).json(producao);
  } catch (error) {
    res.status(500).json({ message: "Erro ao registrar produção", error });
  }
});

// 🔹 Listar produções
router.get("/", async (req, res) => {
  try {
    const producoes = await Producao.findAll();
    res.json(producoes);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar produções", error });
  }
});


router.post("/finalizar", finalizarProducao);
module.exports = router;
