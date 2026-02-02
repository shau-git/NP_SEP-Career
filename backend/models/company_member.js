const { DataTypes } = require('sequelize');
const sequelize = require('../db/connect');

const CompanyMember = sequelize.define('CompanyMember', {
  company_member_id: {
    type: DataTypes.SMALLINT,
    primaryKey: true,
    autoIncrement: true,
  },
  company_id: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(6),
    allowNull: false,
  },
  removed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
  tableName: 'company_member',
  timestamps: false
});

module.exports = CompanyMember;

const User = require('./user');
const Company = require('./company');
CompanyMember.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
CompanyMember.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });