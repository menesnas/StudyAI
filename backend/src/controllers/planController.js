// backend/src/controllers/planController.js
const { LearningPlan, Task, Resource } = require('../models');

// Yeni öğrenme planı oluştur
exports.createPlan = async (req, res) => {
  try {
    const { 
      title, description, subject, targetDuration, 
      dailyStudyTime, knowledgeLevel, startDate, endDate 
    } = req.body;

    const plan = await LearningPlan.create({
      title,
      description,
      subject,
      targetDuration,
      dailyStudyTime,
      knowledgeLevel,
      startDate,
      endDate,
      userId: req.user.id
    });

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
};

// Kullanıcının planlarını getir
exports.getUserPlans = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const plans = await LearningPlan.findAll({
      where: { userId },
      include: [
        { model: Task, as: 'tasks' },
        { model: Resource, as: 'resources' }
      ]
    });

    res.json(plans);
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
};

// Plan detayını getir
exports.getPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const plan = await LearningPlan.findByPk(id, {
      include: [
        { model: Task, as: 'tasks' },
        { model: Resource, as: 'resources' }
      ]
    });

    if (!plan) {
      return res.status(404).json({ 
        error: 'Öğrenme planı bulunamadı' 
      });
    }

    // Yetki kontrolü
    if (plan.userId !== req.user.id) {
      return res.status(403).json({ 
        error: 'Bu plana erişim için yetkiniz yok' 
      });
    }

    res.json(plan);
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
};

// Plan güncelleme
exports.updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, description, subject, targetDuration, 
      dailyStudyTime, knowledgeLevel, startDate, endDate, status 
    } = req.body;

    const plan = await LearningPlan.findByPk(id);

    if (!plan) {
      return res.status(404).json({ 
        error: 'Öğrenme planı bulunamadı' 
      });
    }

    // Yetki kontrolü
    if (plan.userId !== req.user.id) {
      return res.status(403).json({ 
        error: 'Bu planı güncelleme yetkiniz yok' 
      });
    }

    // Planı güncelle
    if (title) plan.title = title;
    if (description) plan.description = description;
    if (subject) plan.subject = subject;
    if (targetDuration) plan.targetDuration = targetDuration;
    if (dailyStudyTime) plan.dailyStudyTime = dailyStudyTime;
    if (knowledgeLevel) plan.knowledgeLevel = knowledgeLevel;
    if (startDate) plan.startDate = startDate;
    if (endDate) plan.endDate = endDate;
    if (status) plan.status = status;

    await plan.save();

    res.json(plan);
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
};

// Plan silme
exports.deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    
    const plan = await LearningPlan.findByPk(id);

    if (!plan) {
      return res.status(404).json({ 
        error: 'Öğrenme planı bulunamadı' 
      });
    }

    // Yetki kontrolü
    if (plan.userId !== req.user.id) {
      return res.status(403).json({ 
        error: 'Bu planı silme yetkiniz yok' 
      });
    }

    await plan.destroy();

    res.json({ message: 'Plan başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
};