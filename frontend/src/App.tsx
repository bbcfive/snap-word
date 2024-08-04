import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import ImageAnalyzer from './components/ImageAnalyzer';
import WordList from './components/WordList';

const App: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [analyzedData, setAnalyzedData] = useState<Array<{
    word: string;
    boundingBox: { x: number; y: number; width: number; height: number };
    sentence: string;
  }>>([]);

  const handleImageUpload = (file: File) => {
    setImage(file);
    // TODO: Send image to backend for analysis
  };

  const handleImageAnalysis = (data: any) => {
    setAnalyzedData(data);
  };

  return (
    <div className="App">
      <h1>Image Vocabulary Builder</h1>
      <ImageUploader onUpload={handleImageUpload} />


      {image && (
        <ImageAnalyzer
          image={image}
          analyzedData={analyzedData}
          onAnalysis={handleImageAnalysis}
        />
      )}
      <WordList words={analyzedData} />
    </div>
  );
};

export default App;