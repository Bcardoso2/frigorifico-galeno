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
    const { nome, tipo, quantidade_kg, categoria } = req.body;
    
    if (!nome || !quantidade_kg) {
      return res.status(400).json({ message: "Nome e quantidade em kg são obrigatórios" });
    }
    
    // Criamos o novo produto no banco de dados
    const novoProduto = await Produto.create({
      nome,
      tipo: tipo || "parte", // Por padrão é uma parte
      quantidade_kg,
      categoria: categoria || "parte", // Por padrão é uma parte
    });
    
    // Também adicionamos ao estoque (se necessário, adicionar esse trecho)
    // await Estoque.create({
    //   produto_id: novoProduto.id,
    //   quantidade_kg,
    //   tipo_movimentacao: "entrada"
    // });
    
    res.status(201).json(novoProduto);
  } catch (error) {
    console.error("❌ Erro ao adicionar produto:", error);
    res.status(500).json({ message: "Erro ao adicionar produto", error: error.message });
  }
});




module.exports = router;
