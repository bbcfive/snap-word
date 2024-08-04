// src/server.ts
import express from 'express';
import multer from 'multer';
import path from 'path';
import { analyzeImage } from './imageAnalysis';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/analyze', upload.single('image'), async (req, res) => {

  // TODO 这个开放模拟效果
  // let mockRes = [{
  //   word: "Desk",
  //   boundingBox: { x: 200, y: 500, width: 200, height: 200 },
  //   sentence: "表示书桌的意思"
  // }]
  // res.json(mockRes);
  // return;


  if (!req.file) {
    return res.status(400).send('No image uploaded');
  }

  try {
    const imagePath = path.join(__dirname, '..', req.file.path);
    const analysisResult = await analyzeImage(imagePath);
    res.json(analysisResult);
  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).send('Error analyzing image');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
