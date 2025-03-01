const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Corte = require("./Corte");

const EstoqueVendas = sequelize.define("EstoqueVendas", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  corte_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Corte,
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  peso_disponivel: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: "estoque_vendas",
  timestamps: false,
});

// 🔹 Definir relacionamento com os cortes
EstoqueVendas.belongsTo(Corte, { foreignKey: "corte_id", as: "corte" });

module.exports = EstoqueVendas;
