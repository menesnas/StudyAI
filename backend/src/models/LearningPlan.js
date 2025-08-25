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
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
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
  status: {
    type: DataTypes.ENUM('active', 'completed', 'paused'),
    defaultValue: 'active',
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
  }
}, {
  // Sequelize otomatik olarak createdAt ve updatedAt alanlarını ekler
  timestamps: true
});

module.exports = LearningPlan;