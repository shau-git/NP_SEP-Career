const { DataTypes } = require('sequelize');
const sequelize = require('../db/connect');

const Language = sequelize.define('Language', {
  language_id: {
    type: DataTypes.SMALLINT,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
  language: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  proficiency: {
    type: DataTypes.STRING(6),
    allowNull: false,
  }
}, {
  tableName: 'language',
  timestamps: false,
  indexes: [{ fields: ['user_id'] }]
});

module.exports = Language;

const User = require('./user');
Language.belongsTo(User, { foreignKey: 'user_id', as: 'user' });