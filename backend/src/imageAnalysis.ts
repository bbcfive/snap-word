
// src/imageAnalysis.ts
import vision from '@google-cloud/vision';
import { promises as fs } from 'fs';
import axios from 'axios';

const client = new vision.ImageAnnotatorClient();

interface AnalyzedItem {
  word: string;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  sentence: string;
}

export async function analyzeImage(imagePath: string): Promise<AnalyzedItem[]> {
  const [result] = await client.labelDetection(imagePath);
  const labels = result.labelAnnotations;

  if (!labels) {
    throw new Error('No labels detected');
  }

  const analyzedItems: AnalyzedItem[] = [];

  for (const label of labels) {
    if (label.description && label.score && label.score > 0.7) {
      const sentence = await generateSentence(label.description);
      analyzedItems.push({
        word: label.description,
        boundingBox: {
          x: Math.random() * 80, // 模拟边界框位置
          y: Math.random() * 80,
          width: 20,
          height: 20,
        },
        sentence,
      });
    }
  }

  // 清理上传的图片文件
  await fs.unlink(imagePath);

  return analyzedItems;
}

async function generateSentence(word: string): Promise<string> {
  try {
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = response.data[0];
    if (data && data.meanings && data.meanings[0] && data.meanings[0].definitions) {
      const definition = data.meanings[0].definitions[0];
      if (definition.example) {
        return definition.example;
      }
    }
  } catch (error) {
    console.error('Error generating sentence:', error);
  }
  
  // 如果无法获取例句,返回一个简单的句子
  return `This is an example of ${word}.`;
}