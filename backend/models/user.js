const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/connect');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class User extends Model {
    // hased the password before saving
    static async hashPassword(user) {
        // check if the hashed_password field modified before
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        return user
    }

    // Instance method to create JWT (equivalent to Mongoose methods)
    createJWT() {
        return jwt.sign(
          { user_id: this.user_id, email: this.email },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_LIFETIME }
        );
    }

    // Instance method to compare passwords
    async comparePassword(candidatePassword) {
        return await bcrypt.compare(candidatePassword, this.password);
    }

}

User.init({
  user_id: {
    type: DataTypes.SMALLINT,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image_public_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(65),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  summary: {
    type: DataTypes.STRING(500),
    allowNull: true,
  }
}, {
  sequelize,
  tableName: 'user',
  timestamps: false
})



// const User = sequelize.define('User', {
//   user_id: {
//     type: DataTypes.SMALLINT,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   name: {
//     type: DataTypes.STRING(50),
//     allowNull: false,
//   },
//   role: {
//     type: DataTypes.STRING(50),
//     allowNull: true,
//   },
//   image: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   image_public_id: {
//     type: DataTypes.STRING(255),
//     allowNull: true,
//   },
//   email: {
//     type: DataTypes.STRING(65),
//     allowNull: false,
//     unique: true,
//   },
//   password: {
//     type: DataTypes.STRING(255),
//     allowNull: true,
//   },
//   summary: {
//     type: DataTypes.STRING(500),
//     allowNull: true,
//   }
// }, {
//   tableName: 'user',
//   timestamps: false
// });

module.exports = User;

// Associations - Load these after export to prevent circular dependency errors
const Skill = require('./skill');
const Language = require('./language');
const Experience = require('./experience');
const Education = require('./education');
const Link = require('./link');
const JobApplicant = require('./jobapplicant');
const CompanyMember = require('./company_member');
const notification = require('./notification');



User.hasMany(Skill, { foreignKey: 'user_id', as: 'skills' });
User.hasMany(Language, { foreignKey: 'user_id', as: 'languages' });
User.hasMany(Experience, { foreignKey: 'user_id', as: 'experiences' });
User.hasMany(Education, { foreignKey: 'user_id', as: 'educations' });
User.hasMany(Link, { foreignKey: 'user_id', as: 'links' });
User.hasMany(JobApplicant, { foreignKey: 'user_id', as: 'job_applicants' });
User.hasMany(CompanyMember, { foreignKey: 'user_id', as: 'company_members' });

// User as Receiver
User.hasMany(notification, { foreignKey: 'user_id', as: 'notifications' });
// User as Sender
User.hasMany(notification, { foreignKey: 'sender_id', as: 'sent_notifications' });