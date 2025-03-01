const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./config/database");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Importar Models
const Produto = require("./models/Produto");
const Corte = require("./models/Corte");

// Importar Rotas
const authRoutes = require("./routes/authRoutes");
const produtoRoutes = require("./routes/produtoRoutes");
const corteRoutes = require("./routes/corteRoutes");
const producaoRoutes = require("./routes/producaoRoutes");
const estoqueRoutes = require("./routes/estoqueRoutes");

app.use("/api/estoque", estoqueRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/produtos", produtoRoutes);
app.use("/api/cortes", corteRoutes);
app.use("/api/producao", producaoRoutes);

// 🔹 Inserir Produtos e Cortes Automaticamente
async function inicializarBanco() {
  await Produto.sync();
  await Corte.sync();

  // 🔹 Criar os produtos (TRASEIRO, DIANTEIRO, P.A)
  const produtos = {
    traseiro: await Produto.findOrCreate({ where: { nome: "TRASEIRO" } }),
    dianteiro: await Produto.findOrCreate({ where: { nome: "DIANTEIRO" } }),
    pa: await Produto.findOrCreate({ where: { nome: "P.A" } }),
  };

  // 🔹 Criar cortes já cadastrados no banco
  const cortes = [
    { nome: "Picanha", produto_id: produtos.traseiro[0].id },
    { nome: "Filé Mignon", produto_id: produtos.traseiro[0].id },
    { nome: "Contra Filé", produto_id: produtos.traseiro[0].id },
    { nome: "Acém", produto_id: produtos.dianteiro[0].id },
    { nome: "Paleta", produto_id: produtos.dianteiro[0].id },
    { nome: "Ponta de Peito", produto_id: produtos.dianteiro[0].id },
    { nome: "Buchada", produto_id: produtos.pa[0].id },
    { nome: "Tott", produto_id: produtos.pa[0].id },
  ];

  for (const corte of cortes) {
    await Corte.findOrCreate({ where: { nome: corte.nome, produto_id: corte.produto_id } });
  }

  console.log("✅ Produtos e cortes inseridos no banco!");
}

// 🔹 Sincronizar banco de dados sem apagar os dados
(async () => {
  try {
    await sequelize.sync({ alter: true }); // 🔹 NÃO apaga os dados
    console.log("✅ Banco de dados sincronizado!");

    // 🔹 Inserir produtos e cortes automaticamente
    await inicializarBanco();
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco:", error);
  }
})();

// Iniciar servidor
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));

module.exports = app;
