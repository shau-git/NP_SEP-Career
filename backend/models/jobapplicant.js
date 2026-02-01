const { DataTypes } = require('sequelize');
const sequelize = require('../db/connect');

const JobApplicant = sequelize.define('JobApplicant', {
  applicant_id: {
    type: DataTypes.SMALLINT,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
  job_post_id: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(10),
    defaultValue: 'PENDING',
  },
  expected_salary: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
  applied_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  interview_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  interview_time: {
    type: DataTypes.STRING(7),
    allowNull: true,
  }
}, {
  tableName: 'job_applicant',
  timestamps: false
});


module.exports = JobApplicant;

// Associations
const JobPost = require('./jobpost');
JobApplicant.belongsTo(JobPost, { foreignKey: 'job_post_id', as: 'job_post' });
// Note: You'll also need to require your User model here to complete the user relation
