const { Sequelize } = require("sequelize");
const Producao = require("../models/Producao");
const Estoque = require("../models/Estoque");
const Corte = require("../models/Corte");
const sequelize = require("../config/database"); // 🔹 Importa a conexão com o banco
const Produto = require("../models/Produto");

// 🔹 Buscar Produção em andamento
const getProducao = async (req, res) => {
  try {
    const producao = await Producao.findAll();
    res.json(producao);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar produção", error: error.message });
  }
};

// 🔹 Iniciar Produção
const iniciarProducao = async (req, res) => {
  const { produto_id, kg_recebido, usuario_id } = req.body;

  const transaction = await sequelize.transaction(); // 🔹 Inicia transação

  try {
    if (!usuario_id) {
      await transaction.rollback();
      return res.status(400).json({ message: "Usuário não informado" });
    }

    const kgRecebidoFloat = parseFloat(kg_recebido);

    if (isNaN(kgRecebidoFloat) || kgRecebidoFloat <= 0) {
      await transaction.rollback();
      return res.status(400).json({ message: "Quantidade inválida!" });
    }

    const item = await Estoque.findOne({ where: { produto_id } });

    if (!item || item.quantidade_kg < kgRecebidoFloat) {
      await transaction.rollback();
      return res.status(400).json({ message: "Estoque insuficiente!" });
    }

    // 🔹 Atualiza o estoque removendo os kg recebidos para produção
    item.quantidade_kg -= kgRecebidoFloat;
    await item.save({ transaction });

    // 🔹 Criar a produção no banco de dados
    await Producao.create(
      {
        produto_id,
        kg_recebido: kgRecebidoFloat,
        kg_final: 0,
        usuario_id,
        status: "Em Produção",
      },
      { transaction }
    );

    await transaction.commit(); // 🔹 Confirma a transação

    res.json({ message: "Produto enviado para produção!" });
  } catch (error) {
    await transaction.rollback(); // 🔹 Reverte alterações em caso de erro
    console.error("❌ Erro ao iniciar produção:", error);
    res.status(500).json({ message: "Erro ao iniciar produção", error: error.message });
  }
};

async function finalizarProducao(req, res) {
  try {
    const { parte_id, cortes, usuario_id } = req.body;
    let totalUtilizado = 0;

    console.log(`📢 Buscando estoque do produto ID: ${parte_id}`);

    let produto = await Produto.findByPk(parte_id);

    if (!produto) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    console.log(`✅ Estoque antes da produção: ${produto.peso_disponivel} kg`);

    for (const corteId in cortes) {
      totalUtilizado += parseFloat(cortes[corteId]);
    }

    if (produto.peso_disponivel < totalUtilizado) {
      return res.status(400).json({ message: "Estoque insuficiente para essa produção." });
    }

    produto.peso_disponivel -= totalUtilizado;
    await produto.save();

    console.log(`✅ Estoque após produção: ${produto.peso_disponivel} kg`);

    // 🔹 Adiciona os cortes ao estoque (produto_id = null)
    for (const corteId in cortes) {
      let pesoCorte = parseFloat(cortes[corteId]);

      await Estoque.create({
        produto_id: null, // ✅ Agora o produto_id pode ser NULL
        corte_id: corteId,
        peso_disponivel: pesoCorte,
      });

      console.log(`✅ Adicionado ${pesoCorte}kg do corte ID: ${corteId} ao estoque.`);
    }

    res.json({ message: "Produção finalizada e estoque atualizado!" });

  } catch (error) {
    console.error("❌ Erro ao finalizar produção:", error);
    res.status(500).json({ message: "Erro ao finalizar produção", error });
  }
}



// 🔹 Exportando as funções corretamente
module.exports = {
  getProducao,
  iniciarProducao,
  finalizarProducao,
};
