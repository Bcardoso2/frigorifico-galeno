const Corte = require("../models/Corte");
const Produto = require("../models/Produto");

// 🔹 Retorna todos os cortes de um produto específico
const getCortesPorProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const cortes = await Corte.findAll({ where: { produto_id: id } });

    res.json(cortes);
  } catch (error) {
    console.error("❌ Erro ao buscar cortes:", error);
    res.status(500).json({ message: "Erro ao buscar cortes", error: error.message });
  }
};

// 🔹 Retorna todos os cortes disponíveis com nome do produto e preço por kg
const getCortes = async (req, res) => {
  try {
    const cortes = await Corte.findAll({
      include: [
        {
          model: Produto,
          as: "produto", // ✅ Define o alias corretamente
          attributes: ["nome"], // 🔹 Obtém apenas o nome do produto associado
        },
      ],
      attributes: ["id", "nome", "preco_kg"], // 🔹 Obtém nome e preço por kg do corte
    });

    // Formata a resposta incluindo os detalhes do produto
    const response = cortes.map((corte) => ({
      id: corte.id,
      nome: corte.nome,
      produto: corte.produto ? corte.produto.nome : "Sem Produto",
      preco_kg: corte.preco_kg,
    }));

    res.json(response);
  } catch (error) {
    console.error("❌ Erro ao buscar cortes:", error);
    res.status(500).json({ message: "Erro ao buscar cortes", error: error.message });
  }
};

// ✅ Exporta corretamente as duas funções
module.exports = { getCortesPorProduto, getCortes };
