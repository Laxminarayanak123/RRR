const jwt = require('jsonwebtoken');
const User = require('../model/User');

async function authenticateAdmin(req, res, next) {
    // console.log("in authenticate admin");
    const jwtSecret = process.env.jwtSecret;
    const authHeader = req.cookies.auth;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided, login via admin' });
    }
  
    const token = authHeader.split(' ')[1];
  
    jwt.verify(token, jwtSecret, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid token , token expired!' });
      }
  
      // Check if the user is an admin
      if (!decoded.isAdmin) {
        return res.status(403).json({ error: 'Not authorized' });
      }
            
        // two step verification
        const AuthUser = await User.findById(decoded.id);  
        if(!AuthUser.isAdmin){
            return res.status(403).json({ error: 'Not authorized' });
        }
        // console.log(decoded,AuthUser);
      next();
    });
  }

module.exports = authenticateAdmin;