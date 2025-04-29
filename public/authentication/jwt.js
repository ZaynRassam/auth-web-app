import jwt from 'jsonwebtoken'

function authenticateJWT(req, res, next){
  const token = req.cookies.jwt

  if (!token) {
    req.user = null
  } else{
    jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, user) => {
      if (err) { // Token invalid
        req.user = null
      } else {
        req.user = user; // Attach user info (including role) to request
      }
    });
  }
  next()
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.render('unathorisedAccess.ejs'); // Forbidden
    }
    next();
  };
}

function loggedInAs(req, res, next){
  if (req.user) {
    console.log(`Logged in as: ${JSON.stringify(req.user)}`)
  } else {
    console.log(`Not logged in`)
  }
  next()
}

export { authenticateJWT, authorizeRoles, loggedInAs }