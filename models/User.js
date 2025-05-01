const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

console.log('Sequelize Object in User Model:', sequelize);

// Definisikan model User
const User = sequelize.define(
  'User', // Nama model
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false, // Username wajib diisi
      // unique: true, // Username harus unik
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, // Password wajib diisi
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, // Nama wajib diisi
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Default value untuk isAdmin adalah false
    },
  },
  {
    tableName: 'users', // Nama tabel di database (opsional, jika ingin eksplisit)
    timestamps: true, // Aktifkan timestamps (createdAt dan updatedAt secara otomatis ditambahkan)
  }
);

// Ekspor model User
module.exports = { User };