const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const File = require('./models/File.js');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://vaibhavmalhotra122002:E5t1BgD2G2dcvG81@cluster0.rafcqhe.mongodb.net/fileShareDB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const newFile = new File({
      filename: req.file.filename,
      originalname: req.file.originalname,
    });
    await newFile.save();
    const link = `http://localhost:5000/uploads/${req.file.filename}`;
    res.json({ link });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.use('/uploads', express.static('uploads'));

app.listen(5000, () => {
  console.log('Server started on http://localhost:5000');
});
