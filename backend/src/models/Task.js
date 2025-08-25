const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'overdue'),
    defaultValue: 'pending'
  },
  priority_level: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium'
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  planId: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  // Sequelize otomatik olarak createdAt ve updatedAt alanlarını ekler
  timestamps: true
});

module.exports = Task;