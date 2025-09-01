const { Task, LearningPlan } = require('../models');
const { search } = require('../services/searchService');


// Yeni görev oluştur
exports.createTask = async (req, res) => {
  try {
    const {
      title, description, day, estimatedTime,
      priority, planId
    } = req.body;

    // Plan kontrolü
    const plan = await LearningPlan.findByPk(planId);

    if (!plan) {
      return res.status(404).json({
        error: 'Öğrenme planı bulunamadı'
      });
    }

    // Yetki kontrolü
    if (plan.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Bu plana görev ekleme yetkiniz yok'
      });
    }

    const task = await Task.create({
      title,
      description,
      day,
      estimatedTime,
      priority,
      planId
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

// Plana ait görevleri getir
exports.getPlanTasks = async (req, res) => {
  try {
    const { planId } = req.params;

    // Plan kontrolü
    const plan = await LearningPlan.findByPk(planId);

    if (!plan) {
      return res.status(404).json({
        error: 'Öğrenme planı bulunamadı'
      });
    }

    // Yetki kontrolü
    if (plan.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Bu planın görevlerini görüntüleme yetkiniz yok'
      });
    }

    const tasks = await Task.findAll({
      where: { planId },
      order: [['day', 'ASC']]
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

// Görev güncelleme
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, description, day, estimatedTime,
      priority, status
    } = req.body;

    const task = await Task.findByPk(id, {
      include: [
        { model: LearningPlan, as: 'plan' }
      ]
    });

    if (!task) {
      return res.status(404).json({
        error: 'Görev bulunamadı'
      });
    }

    // Yetki kontrolü
    if (task.plan.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Bu görevi güncelleme yetkiniz yok'
      });
    }

    // Görevi güncelle
    if (title) task.title = title;
    if (description) task.description = description;
    if (day) task.day = day;
    if (estimatedTime) task.estimatedTime = estimatedTime;
    if (priority) task.priority = priority;
    if (status) task.status = status;

    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

// Görev silme
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByPk(id, {
      include: [
        { model: LearningPlan, as: 'plan' }
      ]
    });

    if (!task) {
      return res.status(404).json({
        error: 'Görev bulunamadı'
      });
    }

    // Yetki kontrolü
    if (task.plan.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Bu görevi silme yetkiniz yok'
      });
    }

    await task.destroy();

    res.json({ message: 'Görev başarıyla silindi' });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

// Belirli bir görevin başlığıyla Google'da arama yap
exports.getTaskResources = async (req, res) => {
  console.log("getTaskResources çağrıldı, taskId:", req.params.id);

  try {
    const { id } = req.params;

    // Task'ı bul
    const task = await Task.findByPk(id, {
      include: [{ model: LearningPlan, as: 'plan' }]
    });

    if (!task) {
      console.log('Task bulunamadı, id:', id);
      return res.status(404).json({ error: 'Görev bulunamadı' });
    }

    console.log('Task bulundu:', task.title);

    // Yetki kontrolü ekle
    if (task.plan && task.plan.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Bu görevin kaynaklarını görüntüleme yetkiniz yok'
      });
    }

    console.log('Search fonksiyonu çağrılıyor, query:', task.title);
    
    // Task title üzerinden arama yap
    const links = await search(task.title);
    
    console.log('Search sonuçları alındı:', links);

    res.json({
      taskId: task.id,
      title: task.title,
      resources: links
    });

  } catch (error) {
    console.error('getTaskResources error:', error);
    res.status(500).json({ 
      error: 'Kaynak arama sırasında hata oluştu: ' + error.message 
    });
  }
};