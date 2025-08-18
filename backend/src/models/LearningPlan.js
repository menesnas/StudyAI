const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LearningPlan = sequelize.define('LearningPlan', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false
  },
  targetDuration: {
    type: DataTypes.INTEGER, // Gün cinsinden
    allowNull: false
  },
  dailyStudyTime: {
    type: DataTypes.INTEGER, // Dakika cinsinden
    allowNull: false
  },
  knowledgeLevel: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },  
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = LearningPlan;