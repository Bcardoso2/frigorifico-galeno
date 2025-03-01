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

module.exports = { getCortesPorProduto };
