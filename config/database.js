const { Sequelize } = require('sequelize');

// Inisialisasi Sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,            // Wajib SSL
      rejectUnauthorized: false // Abaikan validasi sertifikat self-signed
    }
  }
});
console.log('DATABASE_URL:', process.env.DATABASE_URL);

// Log untuk debugging
console.log('Sequelize Object Initialized:', sequelize);

module.exports = sequelize;
