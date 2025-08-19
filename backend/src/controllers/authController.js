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
      console.log('Register request body:', req.body);
      console.log('Password before hashing:', req.body.password);
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
        first_name: firstName,
        last_name: lastName
      });
      
      console.log('Password after hashing:', user.password);

      // Kullanıcı oluşturuldu, token döndür
      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        token: generateToken(user.id)
      });
    } catch (error) {
      // console.error('Register error:', error);
      res.status(500).json({ 
        error: error.message 
      });
    }
  };
  
  // Kullanıcı girişi
  exports.login = async (req, res) => {
    try {
      console.log('Login request body:', req.body);
      const { email, password } = req.body;
  
      // Email ile kullanıcıyı bul
      const user = await User.findOne({ where: { email } });
      console.log('User found:', user ? 'Yes' : 'No');
      
      if (user) {
        console.log('Stored password hash:', user.password);
        console.log('Input password:', password);
        const passwordMatch = await user.comparePassword(password);
        console.log('Password match:', passwordMatch);
      }
  
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
        firstName: user.first_name,
        lastName: user.last_name,
        token: generateToken(user.id)
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        error: error.message 
      });
    }
  };