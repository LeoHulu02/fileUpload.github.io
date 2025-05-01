const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { User } = require('../models/User'); // Pastikan impor ini benar
console.log(User);

console.log('Sequelize Object in File Model:', sequelize);

const File = sequelize.define('File', {
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  originalname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});

// Asosiasi File dengan User
File.belongsTo(User, { foreignKey: 'userId' });

module.exports = { File }; // Sesuaikan dengan cara impor Anda