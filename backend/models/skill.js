const { DataTypes } = require('sequelize');
const sequelize = require('../db/connect');

const Skill = sequelize.define('Skill', {
  skill_id: {
    type: DataTypes.SMALLINT,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
  skill: {
    type: DataTypes.STRING(30),
    allowNull: false,
  }
}, {
  tableName: 'skill',
  timestamps: false,
  indexes: [{ fields: ['user_id'] }]
});

module.exports = Skill;

const User = require('./user');
Skill.belongsTo(User, { foreignKey: 'user_id', as: 'user' });