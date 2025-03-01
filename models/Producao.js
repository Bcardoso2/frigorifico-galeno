const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Produto = require("./Produto");
const Corte = require("./Corte");

const Producao = sequelize.define("Producao", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  produto_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: "produtos", key: "id" } },
  corte_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: "cortes", key: "id" } },
  kg_produzido: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, { tableName: "producao", timestamps: false });

module.exports = Producao;
