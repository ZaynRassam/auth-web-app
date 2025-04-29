import jwt from 'jsonwebtoken'

function authenticateJWT(req, res, next) {
    // const token = req.header('Authorization')?.split(' ')[1];
    const token = req.cookies.jwt
  
    if (!token) return res.sendStatus(401);
  
    jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, user) => {
      if (err) return res.sendStatus(403); // Token invalid
  
      req.user = user; // Attach user info (including role) to request
      next();
    });
  }

  function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
      if (!allowedRoles.includes(req.user.role)) {
        return res.sendStatus(403); // Forbidden
      }
      next();
    };
  }

export { authenticateJWT, authorizeRoles }