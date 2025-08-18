// backend/src/models/index.js
const User = require('./User');
const LearningPlan = require('./LearningPlan');
const Task = require('./Task');
const Resource = require('./Resource');

// İlişkileri tanımlama
User.hasMany(LearningPlan, { foreignKey: 'userId', as: 'plans' });
LearningPlan.belongsTo(User, { foreignKey: 'userId', as: 'user' });

LearningPlan.hasMany(Task, { foreignKey: 'planId', as: 'tasks' });
Task.belongsTo(LearningPlan, { foreignKey: 'planId', as: 'plan' });

LearningPlan.hasMany(Resource, { foreignKey: 'planId', as: 'resources' });
Resource.belongsTo(LearningPlan, { foreignKey: 'planId', as: 'plan' });

module.exports = {
  User,
  LearningPlan,
  Task,
  Resource
};