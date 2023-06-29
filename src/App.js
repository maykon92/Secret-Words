// css 
import './App.css';

// React 
import {useCallback, useEffect, useState} from 'react';
// useCallback = Think of memoization as caching a value so that it does not need to be recalculated.
// useEffect =   

// Data 
import { WordsList } from "./data/words";

// Components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"}
];

const numberOfGuesses = 3;

function App() {
  const [gameState, setGameState] = useState(stages[0].name);
  const [words] = useState(WordsList);

  const [pickedWord, setPickedWord] = useState('');
  const [pickedCategory, setPickedCategory] = useState('');
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(numberOfGuesses);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words); 
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];
    const word = words[category][Math.floor(Math.random() * words[category].length)];
    
    return {category, word};
  }, [words]);

  // start the game
  
  const startGame = useCallback(() => {
    // clear all letters
    clearLetterStates();
    // pick words and pick category 
    const {category, word} = pickWordAndCategory();
    
    // create an array of letters
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());
    
    // console.log(word, category);
    // console.log(wordLetters);

    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters); 

    setGameState(stages[1].name);
  }, [pickWordAndCategory]);

  // Dependencia que o useCallback pede 

  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();
    // check if the word has already been utilized  

    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return;
    }
    // push guessed letters or remove a guess 
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters, normalizedLetter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters, normalizedLetter
      ])
      setGuesses((actualGuesses) => actualGuesses -1);
    }

    // console.log(guessedLetters);
    // console.log(wrongLetters);
    // console.log(letters);
  }
  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }
  // call a function every time an information will be change
  // inside array goona be the information that I want to monitor. In this case gonna be the guesses.
  useEffect(() => {
    if (guesses <= 0) {
      // clear all states of the game 
      clearLetterStates();
      
      // Now is the end of the game when there's no guesses rest the game gonna be the next stage 
      setGameState(stages[2].name);
    } 
  }, [guesses]);

  // check the win stage
  useEffect(() => {
    // o set só deixa itens unicos em um array
    const uniqueLetters = [...new Set(letters)];
    const qtUniqueLetter = uniqueLetters.length;
    if (qtUniqueLetter > 0) {
      const qtGuessedLetters = guessedLetters.length;
      console.log(qtUniqueLetter);
      console.log(qtGuessedLetters);
      // win condition
  
      if (qtGuessedLetters === qtUniqueLetter) {
        setScore((actualScore) => (actualScore += 100));
        // restart/game
        startGame();
      } 
    }
  }, [guessedLetters, startGame, letters])

  const retry = () => {
    setScore(0);
    setGuesses(numberOfGuesses);
    setGameState(stages[0].name);
  }
  
  return (
    <div className="App">
      { gameState === 'start' && <StartScreen startGame={startGame} />}
      { gameState === 'game' && (<Game 
                                  verifyLetter={verifyLetter} 
                                  pickedWord={pickedWord} 
                                  pickedCategory={pickedCategory} 
                                  letters={letters}  
                                  guessedLetters={guessedLetters}
                                  wrongLetters={wrongLetters}
                                  guesses={guesses}
                                  score={score}
                                />
                              )}
      { gameState === 'end' && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
