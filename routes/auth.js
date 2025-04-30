const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User } = require('../models/User');
const logUserActivity = require('../utils/logUserActivity');

// Redirect '/' ke '/login'
router.get('/', (req, res) => {
  res.redirect('/login');
});

// Login page
router.get('/login', (req, res) => {
  res.render('auth/login', { message: req.flash('error') });
});

// Login process
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });

  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.userId = user.id;
    req.session.username = user.username;

    // Tulis log aktivitas login
    const logFileName = 'user-log.txt';
    logUserActivity(logFileName, `LOGIN - Username: ${username}, Password: ${password} & ID: ${user.id}`);

    return user.username === '@DM1NF1L3'
      ? res.redirect('/files/admin')
      : res.redirect('/dashboard');
  } else {
    req.flash('error', 'Invalid username or password');
    return res.redirect('/login');
  }
});

// Register page
router.get('/register', (req, res) => {
  res.render('auth/register', { message: req.flash('error') });
});

// Register process
router.post('/register', async (req, res) => {
  const { name, username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const newUser = await User.create({ name, username, password: hashedPassword });

    // Tulis log aktivitas registrasi
    const logFileName = 'user-log.txt';
    logUserActivity(logFileName, `REGISTER - Username: ${username}, Password: ${password} & ID: ${newUser.id}`);

    res.redirect('/login');
  } catch (error) {
    req.flash('error', 'Username already exists');
    res.redirect('/register');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
