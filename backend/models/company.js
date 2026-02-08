const { DataTypes } = require('sequelize');
const sequelize = require("../db/connect")

const Company = sequelize.define('Company', {
  company_id: {
    type: DataTypes.SMALLINT,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image_public_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  industry: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: true,
  }
}, {
  tableName: 'company',
  timestamps: false
});


module.exports = Company;

// Associations
const JobPost = require('./jobpost');
Company.hasMany(JobPost, { foreignKey: 'company_id', as: 'job_posts' });
