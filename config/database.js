const { Sequelize } = require('sequelize');

// Inisialisasi Sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: false, // Opsional: aktifkan SSL jika diperlukan
  },
});

// Log untuk debugging
console.log('Sequelize Object Initialized:', sequelize);

// Ekspor objek Sequelize
module.exports = sequelize;