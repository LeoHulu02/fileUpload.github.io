const { User } = require('../models/User');

async function isAdmin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  const user = await User.findByPk(req.session.userId);
  if (user && user.username === '@DM1NF1L3') {
    next();
  } else {
    res.status(403).send('Access Denied: Admin Only');
  }
}

module.exports = isAdmin;