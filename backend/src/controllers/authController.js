const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User } = require('../models');

// JWT Token oluşturma
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });
  };
  
  // Kullanıcı kaydı
  exports.register = async (req, res) => {
    try {
      const { username, email, password, firstName, lastName } = req.body;
  
      // Email ve username kontrolü
      const userExists = await User.findOne({ 
        where: { 
          [Op.or]: [{ email }, { username }] 
        } 
      });
  
      if (userExists) {
        return res.status(400).json({ 
          error: 'Bu email veya kullanıcı adı ile kayıtlı bir kullanıcı zaten var' 
        });
      }
  
      // Yeni kullanıcı oluştur
      const user = await User.create({
        username,
        email,
        password,
        firstName,
        lastName
      });
  
      // Kullanıcı oluşturuldu, token döndür
      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        token: generateToken(user.id)
      });
    } catch (error) {
      res.status(500).json({ 
        error: error.message 
      });
    }
  };
  
  // Kullanıcı girişi
  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Email ile kullanıcıyı bul
      const user = await User.findOne({ where: { email } });
  
      // Kullanıcı yoksa veya şifre yanlışsa
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ 
          error: 'Geçersiz email veya şifre' 
        });
      }
  
      // Giriş başarılı, token döndür
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        token: generateToken(user.id)
      });
    } catch (error) {
      res.status(500).json({ 
        error: error.message 
      });
    }
  };