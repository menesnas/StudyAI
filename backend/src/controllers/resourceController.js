const { Resource, LearningPlan } = require('../models');

// Kullanıcının tüm kaynaklarını getir
exports.getAllResources = async (req, res) => {
  try {
    const resources = await Resource.findAll({
      include: [{
        model: LearningPlan,
        as: 'plan',
        where: { userId: req.user.id },
        attributes: ['id', 'title']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(resources);
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
};

// Yeni kaynak oluştur
exports.createResource = async (req, res) => {
  try {
    const { 
      title, description, url, type, 
      difficulty, planId 
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
        error: 'Bu plana kaynak ekleme yetkiniz yok' 
      });
    }

    const resource = await Resource.create({
      title,
      description,
      url,
      type,
      difficulty,
      planId
    });

    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
};

// Plana ait kaynakları getir
exports.getPlanResources = async (req, res) => {
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
        error: 'Bu planın kaynaklarını görüntüleme yetkiniz yok' 
      });
    }

    const resources = await Resource.findAll({
      where: { planId }
    });

    res.json(resources);
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
};

// Kaynak güncelleme
exports.updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, description, url, type, difficulty 
    } = req.body;

    const resource = await Resource.findByPk(id, {
      include: [
        { model: LearningPlan, as: 'plan' }
      ]
    });

    if (!resource) {
      return res.status(404).json({ 
        error: 'Kaynak bulunamadı' 
      });
    }

    // Yetki kontrolü
    if (resource.plan.userId !== req.user.id) {
      return res.status(403).json({ 
        error: 'Bu kaynağı güncelleme yetkiniz yok' 
      });
    }

    // Kaynağı güncelle
    if (title) resource.title = title;
    if (description) resource.description = description;
    if (url) resource.url = url;
    if (type) resource.type = type;
    if (difficulty) resource.difficulty = difficulty;

    await resource.save();

    res.json(resource);
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
};

// Kaynak silme
exports.deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    
    const resource = await Resource.findByPk(id, {
      include: [
        { model: LearningPlan, as: 'plan' }
      ]
    });

    if (!resource) {
      return res.status(404).json({ 
        error: 'Kaynak bulunamadı' 
      });
    }

    // Yetki kontrolü
    if (resource.plan.userId !== req.user.id) {
      return res.status(403).json({ 
        error: 'Bu kaynağı silme yetkiniz yok' 
      });
    }

    await resource.destroy();

    res.json({ message: 'Kaynak başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
};