const { User } = require('../models');
const bcrypt = require('bcryptjs');

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

// Şifre değiştirme
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        error: 'Mevcut şifre ve yeni şifre gerekli' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        error: 'Yeni şifre en az 6 karakter olmalı' 
      });
    }

    // Kullanıcıyı getir
    const user = await User.findByPk(req.user.id);
    
    // Mevcut şifreyi kontrol et
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ 
        error: 'Mevcut şifre yanlış' 
      });
    }

    // Yeni şifreyi kaydet (beforeUpdate hook otomatik hash'leyecek)
    user.password = newPassword;
    await user.save();

    res.json({ 
      message: 'Şifre başarıyla değiştirildi' 
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
};

// Hesap silme
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ 
        error: 'Hesabı silmek için şifrenizi girmeniz gerekli' 
      });
    }

    // Kullanıcıyı getir
    const user = await User.findByPk(req.user.id);
    
    // Şifreyi kontrol et (User model'inin comparePassword metodunu kullan)
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ 
        error: 'Şifre yanlış' 
      });
    }

    // Kullanıcıyı sil (cascade ile ilişkili veriler de silinecek)
    await user.destroy();

    res.json({ 
      message: 'Hesap başarıyla silindi' 
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
};