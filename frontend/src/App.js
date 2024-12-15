import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    const response = await axios.get('http://localhost:5000/words');
    setWords(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { word } = words[currentWordIndex];

    const response = await axios.post('http://localhost:5000/check-word', {
      word, meaning: userInput
    });

    if (response.data.correct) {
      setFeedback('Correct!');
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      setFeedback('Incorrect, try again.');
    }
    setUserInput('');
  };

  if (currentWordIndex >= words.length) {
    return <h2>Congratulations! You've mastered all words!</h2>;
  }

  return (
    <div className="App">
      <h1>Word Memory Trainer</h1>
      <h2>Word: {words[currentWordIndex]?.word}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type the meaning..."
        />
        <button type="submit">Submit</button>
      </form>
      <p>{feedback}</p>
    </div>
  );
}

export default App;