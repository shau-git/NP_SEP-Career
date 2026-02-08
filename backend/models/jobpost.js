const {DataTypes} = require("sequelize")
const sequelize = require("../db/connect")


const JobPost = sequelize.define('JobPost', {
  job_post_id: {
    type: DataTypes.SMALLINT,
    primaryKey: true,
    autoIncrement: true,
  },
  company_id: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    // Foreign key is defined here, but actual relation logic is below
  },
  title: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  industry: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  requirements: {
    type: DataTypes.ARRAY(DataTypes.TEXT), // Supported by Neon (Postgres)
  },
  responsibilities: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
  },
  employment_type: {
    type: DataTypes.STRING(9),
    allowNull: false,
  },
  experience: {
    type: DataTypes.STRING(3),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATEONLY, // Prisma's @db.Date stores date without time
    allowNull: false,
  },
  removed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  salary_start: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  salary_end: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING(6),
    allowNull: false,
  },
  benefit: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
  },
  contact_email: {
    type: DataTypes.STRING(65),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  summary: {
    type: DataTypes.STRING(100),
    allowNull: false,
  }
}, {
  tableName: 'job_post', // table name in Neon
  timestamps: false,
  indexes: [
    { fields: ['company_id'] }, // @@index([company_id])
    { fields: ['created_at'] }  // @@index([created_at])
  ]
});

module.exports = JobPost;

// Associations
const Company = require('./company')
const JobApplicant = require('./jobapplicant');
JobPost.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
JobPost.hasMany(JobApplicant, { foreignKey: 'job_post_id', as: 'applicants' })