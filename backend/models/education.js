const { DataTypes } = require('sequelize');
const sequelize = require('../db/connect');

const Education = sequelize.define('Education', {
  education_id: {
    type: DataTypes.SMALLINT,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
  institution: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  field_of_study: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  qualification: {
    type: DataTypes.STRING(16),
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  study_type: {
    type: DataTypes.STRING(9),
    allowNull: false,
  }
}, {
  tableName: 'education',
  timestamps: false,
  indexes: [{ fields: ['user_id'] }]
});

module.exports = Education;

const User = require('./user');
Education.belongsTo(User, { foreignKey: 'user_id', as: 'user' });