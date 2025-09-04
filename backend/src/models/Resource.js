const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Resource = sequelize.define('Resource', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  planId: {
    type: DataTypes.UUID,
    allowNull: false
  },
}, {
  // Sequelize otomatik olarak createdAt ve updatedAt alanlarını ekler
  timestamps: true
});

module.exports = Resource;