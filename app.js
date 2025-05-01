require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const bcrypt = require('bcryptjs');
const sequelize  = require('./config/database');
const { User } = require('./models/User'); 
const app = express();

console.log('Sequelize Object in App:', sequelize);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'supersecret',
  resave: false,
  saveUninitialized: false,
}));
app.use(flash());

// Static
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', require('./routes/auth'));
app.use('/files', require('./routes/file'));
app.use('/dashboard', require('./routes/dashboard'));

// 404 Page
app.use((req, res) => {
  res.status(404).render('404');
});

// Database Sync and Admin Creation
sequelize.sync().then(async () => {
  console.log('Database synced successfully');
  // Buat Admin jika belum ada
  const adminUsername = '@DM1NF1L3';
  const adminPassword = '@DM1NP@SS';
  const existingAdmin = await User.findOne({ where: { username: adminUsername } });
  if (!existingAdmin) {
    const hashedPassword = bcrypt.hashSync(adminPassword, 10);
    await User.create({
      username: adminUsername,
      password: hashedPassword,
      name: 'Admin',
    });
    console.log('Admin user created.');
  } else {
    console.log('Admin user already exists.');
  }


  // Start the server after syncing the database and ensuring admin exists
  const PORT = process.env.PORT || 8080; // Gunakan default 8080 sebagai cadangan aman
  console.log('PORT ENV:', process.env.PORT);
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on port: ${PORT}`);
  });


}).catch((error) => {
  console.error('Failed to sync database:', error);
  process.exit(1);
});