const { DataTypes } = require('sequelize');
const sequelize = require('../db/connect');

const Experience = sequelize.define('Experience', {
  experience_id: {
    type: DataTypes.SMALLINT,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  years: {
    type: DataTypes.STRING(3),
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATEONLY, // Matches Prisma @db.Date
    allowNull: false,
  },
  end_date: {
    type: DataTypes.STRING, // Kept as string to match your Prisma model
    allowNull: false,
  },
  employment_type: {
    type: DataTypes.STRING(9),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: false,
  }
}, {
  tableName: 'experience',
  timestamps: false,
  indexes: [{ fields: ['user_id'] }]
});

module.exports = Experience;

const User = require('./user');
Experience.belongsTo(User, { foreignKey: 'user_id', as: 'user' });