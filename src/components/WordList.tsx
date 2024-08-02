import React from 'react';

interface Word {
  word: string;
  sentence: string;
}

interface WordListProps {
  words: Word[];
}

const WordList: React.FC<WordListProps> = ({ words }) => {
  const speakSentence = (sentence: string) => {
    const utterance = new SpeechSynthesisUtterance(sentence);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <ul>
      {words.map((item, index) => (
        <li key={index}>
          <strong>{item.word}</strong>: {item.sentence}
          <button onClick={() => speakSentence(item.sentence)}>Speak</button>
        </li>
      ))}
    </ul>
  );
};

export default WordList;