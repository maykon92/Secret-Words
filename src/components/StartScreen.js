import Styles from './StartScreen.css';

const StartScreen = ({startGame}) => {
    return (
        <div className={Styles.start}>
            <h1>Secret Word</h1>
            <p>Clique no botão abaixo para iniciar o jogo!</p>
            <button onClick={startGame}>Começar o jogo</button>
        </div>
    );
}
export default StartScreen