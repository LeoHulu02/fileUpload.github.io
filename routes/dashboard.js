const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
console.log(User)

router.get('/', async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  const user = await User.findByPk(req.session.userId);

  // Jika user adalah admin, arahkan langsung ke halaman admin
  if (user.username === '@DM1NF1L3') {
    return res.redirect('/files/admin');
  }

  // Jika bukan admin, tampilkan dashboard user biasa
  res.render('dashboard', { user });
});

module.exports = router;
