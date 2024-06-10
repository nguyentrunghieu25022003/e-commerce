function roleCheck(role) {
  return (req, res, next) => {
    if (req.isAuthenticated() && role.includes(req.user.role)) {
      next();
    } else {
      res.status(401).send("Access Denied: You do not have the correct role");
    }
  };
}

module.exports = roleCheck;
