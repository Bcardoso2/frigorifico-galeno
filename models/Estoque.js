const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Produto = require("./Produto");
const Corte = require("./Corte");

const Estoque = sequelize.define("Estoque", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  produto_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // ✅ Agora pode ser NULL para cortes
    references: { model: Produto, key: "id" },
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  },
  corte_id: {
    type: DataTypes.INTEGER,
    allowNull: false, // ✅ Obrigatório para cortes produzidos
    references: { model: Corte, key: "id" },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  peso_disponivel: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
});

Estoque.belongsTo(Produto, { foreignKey: "produto_id" });
Estoque.belongsTo(Corte, { foreignKey: "corte_id" });

module.exports = Estoque;
