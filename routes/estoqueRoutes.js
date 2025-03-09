const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const Estoque = require("../models/Estoque");
const Produto = require("../models/Produto");
const Corte = require("../models/Corte"); // 🔹 Certifique-se de que está importado corretamente
const { adicionarEstoque } = require("../controllers/estoqueController");
// 🔹 Rota para adicionar estoque
router.post("/entrada", adicionarEstoque);

router.get("/cortes_disponiveis", async (req, res) => {
  try {
    const cortesMaisEstoque = await Estoque.findAll({
      include: [
        {
          model: Corte,
          attributes: ["nome", "preco_kg"], // 🔹 Agora inclui o preço por kg
        },
      ],
      where: {
        corte_id: { [Op.ne]: null }, // 🔹 Busca apenas os cortes (não os produtos inteiros)
        peso_disponivel: { [Op.gt]: 0 },
      },
      order: [["peso_disponivel", "DESC"]],
      limit: 10,
    });

    if (cortesMaisEstoque.length === 0) {
      console.log("⚠️ Nenhum corte com estoque disponível.");
    }

    res.json(
      cortesMaisEstoque.map((item) => ({
        id: item.id,
        nome: item.Corte ? item.Corte.nome : "Desconhecido",
        quantidade_kg: item.peso_disponivel,
        preco_kg: item.Corte ? item.Corte.preco_kg : 0, // 🔹 Adicionando o preço do corte na resposta
      }))
    );
  } catch (error) {
    console.error("❌ Erro ao buscar cortes com mais estoque:", error);
    res.status(500).json({ message: "Erro ao buscar cortes com mais estoque", error });
  }
});
  router.get("/produtos", async (req, res) => {
    try {
        const produtos = await Produto.findAll({
            attributes: ["id", "nome", "peso_disponivel"], 
            where: { peso_disponivel: { [Op.gt]: 0 } } // Apenas produtos com estoque
        });

        res.json(produtos);
    } catch (error) {
        console.error("❌ Erro ao buscar produtos:", error);
        res.status(500).json({ message: "Erro ao buscar produtos", error });
    }
});

router.get("/", async (req, res) => {
    try {
      const estoque = await Estoque.findAll({
        include: [
          {
            model: Produto,
            attributes: ["id", "nome"], // 🔹 Busca nome do produto
          },
          {
            model: Corte,
            attributes: ["id", "nome"], // 🔹 Busca nome do corte (se aplicável)
          },
        ],
        where: {
          peso_disponivel: { [Op.gt]: 0 }, // 🔹 Apenas itens com quantidade maior que 0
        },
        order: [["peso_disponivel", "DESC"]], // 🔹 Ordena pelo maior estoque
      });
  
      // 🔹 Formata a resposta
      const response = estoque.map((item) => ({
        id: item.id,
        produto: item.Produto ? item.Produto.nome : "Sem Produto",
        corte: item.Corte ? item.Corte.nome : null,
        quantidade_kg: item.peso_disponivel,
      }));
  
      res.json(response);
    } catch (error) {
      console.error("❌ Erro ao buscar estoque:", error);
      res.status(500).json({ message: "Erro ao buscar estoque", error });
    }
  });
  

module.exports = router;
