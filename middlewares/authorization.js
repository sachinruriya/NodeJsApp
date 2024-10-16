function userauthorization(roles) {
    return (req, res, next) => {
      const userRole = req.user.role;
      console.log(userRole)
      if (roles.includes(userRole)) {
        return next();  // User has the right role, proceed to the next middleware
      }
  
      res.status(403).send('Access denied');  // User doesn't have the right role, block access
    };
  }
  function adminAuthorization(roles) {
    return (req, res, next) => {
      const userRole = req.user.role;
      console.log(userRole)
      if (roles.includes(userRole)) {
        return next();  // User has the right role, proceed to the next middleware
      }
  
      res.status(403).send('Access denied and Invalid Email or Password');  // User doesn't have the right role, block access
    };
  }
  module.exports = { userauthorization,adminAuthorization };
  
  