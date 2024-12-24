const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const hangmanImage = document.querySelector(".hangman-box img");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = gameModal.querySelector("button");

// Initializing game variables
let currentWord, correctLetters, wrongGuessCount;
const maxGuesses = 6;
let consecutiveWins = 0;

const resetGame = () => {
    // Ressetting game variables and UI elements
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = "images/hangman-0.svg";
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    gameModal.classList.remove("show");
}

let usedWords = [];

const getRandomWord = () => {
   // Filtrar las palabras que no han sido usadas
   const unusedWords = wordList.filter(item => !usedWords.includes(item.word));

   if (unusedWords.length === 0) {      
       // Reiniciar la lista de palabras usadas si todas las palabras han sido usadas
       usedWords = [];
   }

   // Seleccionar una palabra no usada al azar
   const { word, hint } = unusedWords[Math.floor(Math.random() * unusedWords.length)];
   
   // Añadir la palabra seleccionada a la lista de usadas
   usedWords.push(word);

   currentWord = word; // Establecer la palabra actual
   document.querySelector(".hint-text b").innerText = hint;
   resetGame();
}

const gameOver = (isVictory) => {
    // Actualizar contador de palabras acertadas consecutivamente
    if (isVictory) {
        consecutiveWins++;
    }

    // Comprobar si se han acertado dos palabras consecutivas
    if (isVictory && consecutiveWins === 2) {
        window.location.href = "Final.html";
        consecutiveWins = 0; // Reiniciar el contador si deseas que ocurra solo una vez
        getRandomWord(); // Cargar una nueva palabra después del mensaje especial
        return;
    }

    if (!isVictory) {
        // Si pierde, reiniciar con la misma palabra
        resetGame(); // Restablece el estado del juego sin cambiar la palabra
        return; // Salir de la función para evitar mostrar el modal
    }

    // Si el jugador gana pero no lleva dos consecutivas, cargar una nueva palabra
    if (isVictory && consecutiveWins < 2) {
        getRandomWord(); // Cambiar automáticamente a una nueva palabra
        return;
    }
};

const initGame = (button, clickedLetter) => {
    // Checking if clickedLetter is exist on the currentWord
    if(currentWord.includes(clickedLetter)) {
        // Showing all correct letters on the word display
        [...currentWord].forEach((letter, index) => {
            if(letter === clickedLetter) {
                correctLetters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        });
    } else {
        // If clicked letter doesn't exist then update the wrongGuessCount and hangman image
        wrongGuessCount++;
        hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
    }
    button.disabled = true; // Disabling the clicked button so user can't click again
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

    // Calling gameOver function if any of these condition meets
    if(wrongGuessCount === maxGuesses) return gameOver(false);
    if(correctLetters.length === currentWord.length) return gameOver(true);
}

// Creating keyboard buttons and adding event listeners
for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener("click", (e) => initGame(e.target, String.fromCharCode(i)));
}

getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);