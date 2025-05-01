const { Sequelize } = require('sequelize');

// Inisialisasi Sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: true, // Opsional: aktifkan SSL jika diperlukan
    rejectUnauthorized: false, 
  },
});

// Log untuk debugging
console.log('Sequelize Object Initialized:', sequelize);

// Ekspor objek Sequelize
module.exports = sequelize;