import './GameOver.css';
const GameOver = ({retry, score}) => {
  return (
    <div>
        <h1>Game Over seu merda</h1>
        <h2>Your score was: <span>{score}</span></h2>
        <button onClick={retry}>Resetar</button>
    </div>
  )
}

export default GameOver;