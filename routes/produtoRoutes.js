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


router.post("/", async (req, res) => {
  try {
    const { produto_id, quantidade_kg, tipo_movimentacao } = req.body;
    
    if (!produto_id || !quantidade_kg) {
      return res.status(400).json({ message: "ID do produto e quantidade em kg são obrigatórios" });
    }
    
    // Verificar se o produto existe
    const produto = await Produto.findByPk(produto_id);
    if (!produto) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }
    
    // Adicionar entrada no estoque
    const novaEntrada = await Estoque.create({
      produto_id,
      quantidade_kg,
      tipo_movimentacao: tipo_movimentacao || "entrada",
      data_movimentacao: new Date()
    });
    
    // Atualizar o peso disponível do produto (isso depende da sua lógica de negócio)
    // Exemplo: obter o total no estoque após a adição
    
    // Retornar o registro de estoque criado
    res.status(201).json(novaEntrada);
  } catch (error) {
    console.error("❌ Erro ao adicionar ao estoque:", error);
    res.status(500).json({ message: "Erro ao adicionar ao estoque", error: error.message });
  }
});


module.exports = router;
