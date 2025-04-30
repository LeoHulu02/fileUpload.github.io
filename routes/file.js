const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { File } = require('../models/File');
const { User } = require('../models/User');
const isAuthenticated = require('../middlewares/authMiddleware').isAuthenticated;
const isAdmin = require('../middlewares/isAdmin');

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// USER AREA
// Form Upload File
router.get('/upload', isAuthenticated, (req, res) => {
  res.render('upload', { message: req.flash('info') });
});

// Handle Upload File
router.post('/upload', isAuthenticated, upload.single('file'), async (req, res) => {
  try {
    await File.create({
      filename: req.file.filename,
      originalname: req.file.originalname,
      userId: req.session.userId,
    });
    req.flash('info', 'File berhasil diupload');
    res.redirect('/files/all');
  } catch (error) {
    req.flash('error', 'Gagal mengunggah file');
    res.redirect('/files/upload');
  }
});

// List semua file milik user
// router.get('/all', isAuthenticated, async (req, res) => {
//   const files = await File.findAll({ where: { userId: req.session.userId } });
//   res.render('allFiles', { files });
// });

// Delete file user
router.post('/delete/:id', isAuthenticated, async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (file && file.userId === req.session.userId) {
      const filePath = path.join(__dirname, '../uploads', file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      await file.destroy();
    }
    res.redirect('/files/all');
  } catch (error) {
    res.redirect('/files/all');
  }
});

// Download file user
router.get('/download/:id', isAuthenticated, async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (file && file.userId === req.session.userId) {
      res.download(path.join(__dirname, '../uploads', file.filename), file.originalname);
    } else {
      res.redirect('/files/all');
    }
  } catch (error) {
    res.redirect('/files/all');
  }
});

// ADMIN AREA
// Admin lihat semua file semua user
router.get('/admin', isAuthenticated, isAdmin, async (req, res) => {
  const files = await File.findAll({ include: User });
  res.render('adminFiles', { files });
});

// Admin delete file siapa saja
router.post('/admin/delete/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (file) {
      const filePath = path.join(__dirname, '../uploads', file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      await file.destroy();
    }
    res.redirect('/files/admin');
  } catch (error) {
    res.redirect('/files/admin');
  }
});

// Admin download file siapa saja
router.get('/admin/download/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (file) {
      res.download(path.join(__dirname, '../uploads', file.filename), file.originalname);
    } else {
      res.redirect('/files/admin');
    }
  } catch (error) {
    res.redirect('/files/admin');
  }
});

// Admin preview file content
router.get('/admin/preview/:id', isAuthenticated, isAdmin, async (req, res) => {
  const file = await File.findByPk(req.params.id);
  if (!file) {
    return res.status(404).send('File not found.');
  }

  const filePath = path.join(__dirname, '../uploads', file.filename);

  // Cek apakah file ada
  if (!fs.existsSync(filePath)) {
    return res.status(500).send('File not found on disk.');
  }

  // Baca isi file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).send('Error reading file.');
    }
    res.send(data); // Kirim isi file sebagai respons
  });
});

module.exports = router;