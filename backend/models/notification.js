const { DataTypes } = require('sequelize');
const sequelize = require('../db/connect');

const Notification = sequelize.define('Notification', {
  notification_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER, // Receiver
    allowNull: false,
  },
  sender_id: {
    type: DataTypes.INTEGER, // Triggering User
    allowNull: true,
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  job_post_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
  tableName: 'notification',
  timestamps: false,
  indexes: [{ fields: ['user_id'] }]
});

module.exports = Notification;

const User = require('./user');
const Company = require('./company');
const JobPost = require('./jobpost');

Notification.belongsTo(User, { foreignKey: 'user_id', as: 'receiver' });
Notification.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
Notification.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
Notification.belongsTo(JobPost, { foreignKey: 'job_post_id', as: 'job_post' });