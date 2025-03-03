const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Produto = require("./Produto");

const Corte = sequelize.define(
  "Corte",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    produto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Produto, key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    preco_kg: { // 🔹 Confirme que esse campo está no modelo
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "cortes",
    timestamps: false,
  }
);

// 🔹 Definir relacionamento corretamente
Corte.belongsTo(Produto, { foreignKey: "produto_id", as: "produto" });
Produto.hasMany(Corte, { foreignKey: "produto_id", as: "cortes" });

module.exports = Corte;
