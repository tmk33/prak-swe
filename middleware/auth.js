// auth.js

const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET; 

function authenticateAdmin(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]; // Get token from header
    
    if (!token) {
      return res.status(401).json({ error: 'No tokens' });
    }
  
    try {
      const decoded = jwt.verify(token, jwtSecret);
      if (decoded.rolle === 'Admin') {
        req.mitarbeiter = decoded; // Save Admin information in req
        next();
      } else {
        return res.status(403).json({ error: 'Unauthorized' });
      }
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
}

module.exports = {
  authenticateAdmin
};
