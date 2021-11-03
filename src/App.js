import "./styles.css";
import { useState } from "react";
import { Letter } from "./components/Letter";
import { Button } from "./components/Button";

const apiService =
  "https://palabras-aleatorias-public-api.herokuapp.com/random";

export default function App() {
  const [word, setWord] = useState([]);
  const [hidden, setHidden] = useState([]);
  const [lettersChosed, setLettersChosed] = useState([]);
  const [alphabetVisible, setAlphabetVisible] = useState(false);
  const [spacesVisible, setSpacesVisible] = useState(false);
  const [result, setResult] = useState({
    chances: 6,
    message: ""
  });

  const alphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "Ñ",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    " "
  ];

  const handleHangman = () => {
    fetch(apiService)
      .then((response) => {
        if (response.status === 200) {
          //Promesa 2 transformacion de la respuesta en un json
          response.json().then((data) => {
            var wordArray = data.body.Word.toUpperCase()
              .replace("Á", "A")
              .replace("É", "E")
              .replace("Í", "I")
              .replace("Ó", "O")
              .replace("Ú", "U")
              .split("");
            setWord(wordArray);
            setHidden(new Array(wordArray.length).fill("_"));
            setAlphabetVisible(true);
            setSpacesVisible(true);
            setResult({
              ...result,
              chances: 6,
              message: "You have 6 chances!"
            });
            setLettersChosed([]);
            console.log(wordArray);
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });

    setResult({
      ...result,
      message: "Loading..."
    });
    setAlphabetVisible(false);
    setSpacesVisible(false);
  };

  const handleButtonLetter = (letterAlphabet) => {
    let founded = false;
    let arrayLettersChosed = lettersChosed.slice();
    let arrayLettersFounded = [];
    let countLeftLetter = 0;

    arrayLettersChosed.push(letterAlphabet);
    setLettersChosed(arrayLettersChosed);

    for (let i = 0; i < word.length; i++) {
      if (hidden[i] === "_") {
        if (word[i] === letterAlphabet) {
          arrayLettersFounded.push(letterAlphabet);
          founded = true;
        } else {
          arrayLettersFounded.push("_");
          countLeftLetter++;
        }
      } else arrayLettersFounded.push(hidden[i]);
    }

    setHidden(arrayLettersFounded);

    if (countLeftLetter === 0) {
      setAlphabetVisible(false);
      setResult({
        ...result,
        message: "You win! Try Again press Start button..."
      });
    } else if (founded === false) {
      let chances = result.chances - 1;
      let message = "";

      if (chances === 0) {
        setAlphabetVisible(false);
        message = "You lose! Try Again press Start button...";
        setHidden(word.slice());
      } else message = "You have " + chances + " chances!";

      setResult({
        ...result,
        chances: chances,
        message: message
      });
    }
  };

  return (
    <div className="App">
      <h1>The Hangman Game</h1>
      <h2>Please start button to play!</h2>
      <button onClick={handleHangman}>Start</button>
      <h3>{result.message}</h3>
      <div id="divAlphabet" className="alphabet">
        {alphabetVisible
          ? alphabet.map((letterAlphabet, index) =>
              lettersChosed.includes(letterAlphabet) ? (
                <Button
                  key={index}
                  caption={letterAlphabet}
                  onClick={handleButtonLetter}
                  disabled={true}
                />
              ) : (
                <Button
                  key={index}
                  caption={letterAlphabet}
                  onClick={handleButtonLetter}
                  disabled={false}
                />
              )
            )
          : null}
      </div>
      <div className="letterHidden">
        {spacesVisible
          ? hidden.map((letterHidden, index) => (
              <Letter key={index} caption={letterHidden} />
            ))
          : null}
      </div>
    </div>
  );
}
