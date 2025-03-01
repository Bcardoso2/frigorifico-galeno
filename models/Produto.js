const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Produto = sequelize.define("Produto", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.ENUM("TRASEIRO", "DIANTEIRO", "P.A"),
    allowNull: false,
  },
  peso_disponivel: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0, // Inicialmente sem estoque
  },
}, {
  tableName: "produtos",
  timestamps: false,
});

module.exports = Produto;
