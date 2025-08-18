const jwt = require('jsonwebtoken');
const { User } = require('../models');

const protect = async (req, res, next) => {
  let token;

  // Token'ı header'dan al
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Token yoksa hata döndür
  if (!token) {
    return res.status(401).json({ 
      error: 'Bu rotaya erişim için yetkiniz yok' 
    });
  }

  try {
    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kullanıcıyı bul
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ 
        error: 'Kullanıcı bulunamadı' 
      });
    }

    // Kullanıcıyı request'e ekle
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ 
      error: 'Bu rotaya erişim için yetkiniz yok' 
    });
  }
};

module.exports = { protect };