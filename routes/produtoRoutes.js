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
    const { produto_id, quantidade_kg } = req.body;
    
    if (!produto_id || !quantidade_kg) {
      return res.status(400).json({ message: "ID do produto e quantidade em kg são obrigatórios" });
    }
    
    // Verificar se o produto existe
    const produto = await Produto.findByPk(produto_id);
    if (!produto) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }
    
    // Atualizar o peso disponível somando a nova quantidade
    const novopesoDisponivel = produto.peso_disponivel + parseFloat(quantidade_kg);
    
    // Salvar a atualização
    await produto.update({ peso_disponivel: novopesoDisponivel });
    
    // Buscar o produto atualizado para retornar
    const produtoAtualizado = await Produto.findByPk(produto_id);
    
    // Retornar o produto com o peso atualizado
    res.status(200).json(produtoAtualizado);
  } catch (error) {
    console.error("❌ Erro ao adicionar ao estoque:", error);
    res.status(500).json({ message: "Erro ao adicionar ao estoque", error: error.message });
  }
});

module.exports = router;
