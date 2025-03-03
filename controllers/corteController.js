const Corte = require("../models/Corte");

// 🔹 Retorna todos os cortes de uma parte específica
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

const getCortes = async (req, res) => {
  try {
    const cortes = await Corte.findAll({
      include: [
        {
          model: Produto,
          attributes: ["nome"], // 🔹 Obtém o nome do produto associado
        },
      ],
      attributes: ["id", "nome", "preco_kg"], // 🔹 Obtém o nome e preço por kg
    });

    // Formata a resposta incluindo os detalhes do produto
    const response = cortes.map((corte) => ({
      id: corte.id,
      nome: corte.nome,
      produto: corte.Produto ? corte.Produto.nome : "Sem Produto",
      preco_kg: corte.preco_kg,
    }));

    res.json(response);
  } catch (error) {
    console.error("❌ Erro ao buscar cortes:", error);
    res.status(500).json({ message: "Erro ao buscar cortes", error: error.message });
  }
};


module.exports = { getCortesPorProduto, getCortes};
