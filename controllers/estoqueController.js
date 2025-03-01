const Produto = require("../models/Produto");

// 🔹 Adicionar matéria-prima ao estoque
const adicionarEstoque = async (req, res) => {
  try {
      const { produto_id, corte_id, peso_disponivel } = req.body;

      // 🔹 Verifica se pelo menos um dos campos está preenchido, mas não os dois
      if ((!produto_id && !corte_id) || (produto_id && corte_id)) {
          return res.status(400).json({ message: "Informe apenas produto_id OU corte_id, nunca os dois juntos." });
      }

      const novoEstoque = await Estoque.create({ produto_id, corte_id, peso_disponivel });

      res.status(201).json({ message: "Estoque atualizado!", novoEstoque });
  } catch (error) {
      console.error("❌ Erro ao adicionar estoque:", error);
      res.status(500).json({ message: "Erro ao adicionar estoque", error });
  }
};
module.exports = { adicionarEstoque };
