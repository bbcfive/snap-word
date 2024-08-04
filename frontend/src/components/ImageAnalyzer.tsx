import React, { useEffect, useRef } from 'react';

interface AnalyzedItem {
  word: string;
  boundingBox: { x: number; y: number; width: number; height: number };
  sentence: string;
}

interface ImageAnalyzerProps {
  image: File;
  analyzedData: AnalyzedItem[];
  onAnalysis: (data: AnalyzedItem[]) => void;
}

let uploadAndParse = (image: any, onAnalysis: any) => {
  const analyzeImage = async () => {
    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      onAnalysis(data);
    } catch (error) {
      console.error('Error analyzing image:', error);
    }
  };
  analyzeImage();
}

const ImageAnalyzer: React.FC<ImageAnalyzerProps> = ({ image, analyzedData, onAnalysis }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // useEffect(() => {
  //   const analyzeImage = async () => {
  //     const formData = new FormData();
  //     formData.append('image', image);

  //     try {
  //       const response = await fetch('/analyze', {
  //         method: 'POST',
  //         body: formData,
  //       });
  //       const data = await response.json();
  //       onAnalysis(data);
  //     } catch (error) {
  //       console.error('Error analyzing image:', error);
  //     }
  //   };

  //   analyzeImage();
  // }, [image, onAnalysis]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (canvas && ctx) {
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        analyzedData.forEach(item => {
          const { x, y, width, height } = item.boundingBox;
          ctx.strokeStyle = 'red';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, width, height);

          ctx.fillStyle = 'white';
          ctx.fillRect(x, y - 20, ctx.measureText(item.word).width + 10, 20);
          ctx.fillStyle = 'black';
          ctx.fillText(item.word, x + 5, y - 5);
        });
      };
      img.src = URL.createObjectURL(image);
    }
  }, [image, analyzedData]);

  return <div>
    <div>
      {image && (<div><button onClick={() => {
        uploadAndParse(image, onAnalysis)
      }}>do parse</button></div>)}

      <canvas style={{
        height: "400px",
        padding: "20px",
        display: "flex",
        textAlign: "center",
        background: "white",
        width: "400px",
      }} ref={canvasRef} />
    </div>


  </div >
};



export default ImageAnalyzer;