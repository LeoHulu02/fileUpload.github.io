const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false, // Nonaktifkan query log jika tidak dibutuhkan
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL on Railway');
  } catch (err) {
    console.error('❌ Unable to connect to PostgreSQL:', err);
  }
})();

module.exports = sequelize;
