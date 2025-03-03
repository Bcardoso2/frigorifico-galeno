const Corte = require("../models/Corte");
const Produto = require("../models/Produto");

// 🔹 Retorna todos os cortes de um produto específico com preço por KG
const getCortesPorProduto = async (req, res) => {
  try {
    const { id } = req.params;

    const cortes = await Corte.findAll({
      where: { produto_id: id },
      include: [
        {
          model: Produto,
          as: "produto",
          attributes: ["nome"], // 🔹 Pegamos apenas o nome do produto
        },
      ],
      attributes: ["id", "nome", "preco_por_kg"], // 🔹 Incluímos o preço no retorno
    });

    res.json(cortes);
  } catch (error) {
    console.error("❌ Erro ao buscar cortes:", error);
    res.status(500).json({ message: "Erro ao buscar cortes", error: error.message });
  }
};

module.exports = { getCortesPorProduto };
