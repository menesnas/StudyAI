const { User } = require('../models');

// Kullanıcı profilini getir
exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ 
        error: 'Kullanıcı bulunamadı' 
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
};

// Kendi profilini getir
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
};

// Profil güncelleme
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, username } = req.body;
    
    // Kullanıcıyı güncelle
    const user = await User.findByPk(req.user.id);
    
    if (username) user.username = username;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    
    await user.save();

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
};