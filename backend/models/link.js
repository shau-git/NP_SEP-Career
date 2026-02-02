const { DataTypes } = require('sequelize');
const sequelize = require('../db/connect');

const Link = sequelize.define('Link', {
  link_id: {
    type: DataTypes.SMALLINT,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING(255),
    allowNull: false,
  }
}, {
  tableName: 'link',
  timestamps: false,
  indexes: [{ fields: ['user_id'] }]
});

module.exports = Link;

const User = require('./user');
Link.belongsTo(User, { foreignKey: 'user_id', as: 'user', onDelete: 'CASCADE' });