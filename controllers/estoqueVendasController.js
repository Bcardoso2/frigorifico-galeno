const EstoqueVendas = require("../models/EstoqueVendas");
const Corte = require("../models/Corte");

async function getEstoqueVendas(req, res) {
  try {
    const estoque = await EstoqueVendas.findAll({
      include: { model: Corte, as: "corte" },
    });

    res.json(estoque);
  } catch (error) {
    console.error("❌ Erro ao buscar estoque de vendas:", error);
    res.status(500).json({ message: "Erro ao buscar estoque de vendas", error: error.message });
  }
}

module.exports = { getEstoqueVendas };
