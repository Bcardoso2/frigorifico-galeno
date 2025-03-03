const express = require("express");
const router = express.Router();
const { getCortesPorProduto } = require("../controllers/corteController");

// 🔹 Rota para buscar cortes de um produto específico
router.get("/parte/:id", getCortesPorProduto);

router.get("/", async (req, res) => {
    try {
      const cortes = await Corte.findAll({
        include: [{ model: Produto, as: "produto", attributes: ["nome"] }],
        attributes: ["id", "nome", "preco_por_kg"],  // ✅ Incluindo preço
      });
  
      res.json(cortes);
    } catch (error) {
      console.error("Erro ao buscar cortes:", error);
      res.status(500).json({ message: "Erro ao buscar cortes" });
    }
  });

module.exports = router;
