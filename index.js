// input + enviar \\
const input = document.getElementById("guessedNumber");
const sendGuess = document.getElementById("sendGuess");

// text alert \\
const text = document.getElementById("warningText");

//new game button \\
const newGame = document.getElementById("newGame");

//start button \\
const startButton = document.getElementById("startGame");

//svg container to manipulate colors \\
const numbers = document.getElementById("numbers");

// svg container to manipulate paths and form the numbers \\
const firstNumber = document.getElementById("number-1");
const secondNumber = document.getElementById("number-2");
const thirdNumber = document.getElementById("number-3");

// function that will check if the guess contains only numbers \\
function checkInput(str) {
  var pattern = /^\d+$/;
  // returns a boolean
  return pattern.test(str);
}

// iniciating the number variable \\
let number;

// getting the number variable from the API \\
async function GetData() {
  const response = await fetch(
    "https://us-central1-ss-devops.cloudfunctions.net/rand?min=1&max=300"
  );
  const value = await response.json();

  // treating the error status code 502 \\
  if (value.StatusCode == 502) {
    // setting the svg numbers to 502 \\
    firstNumber.setAttribute("class", "num-5");
    secondNumber.setAttribute("class", "num-0");
    thirdNumber.setAttribute("class", "num-2");

    //setting the text warning to visible and the text to ERROR \\
    text.style.visibility = "visible";
    text.style.textAlign = "center";
    numbers.className += " error";
    text.style.color = "#cc3300";
    text.innerHTML = "Erro!!";

    // disabling the inputs \\
    input.disabled = true;
    sendGuess.disabled = true;

    // showing the NEWGAME button \\
    newGame.style.display = "flex";
  }

  // setting the variable initiated before \\
  number = value.value;

  // returning the variable \\
  return number;
}

// initializing the function that gets the number \\
GetData();

// formating the number ( the GUESS we get from the input) \\
function Format(n) {
  // example: 235 / 100 = 2,35 => Math.floor() excludes the decimals, returning 2
  let hundred = Math.floor(n / 100);

  // example: 235 / 10 = 23,5 => => Math.floor() excludes the decimals, returning 23
  // => 23 % 10 equals to 23 / 10 = 2.3, the % operator exclude the integer (2),
  // returning the 3
  let dozens = Math.floor(n / 10) % 10;

  // same goes here 235 / 10 = 23,5, the integer are excluded - 23,
  // and the return is 5.
  let unit = n % 10;

  // checking if the hundred is equal to zero,
  // if so, changing the value to null, will ultimately
  // change the class -in the send button -,
  // and my CSS is waiting for it to display none the zeros \\
  if (hundred == 0) {
    hundred = null;

    if (dozens == 0) {
      dozens = null;
    }
  }

  return [hundred, dozens, unit];
}

// function to start the game, it will close the modal
// and show the input and numbers
function Start(e) {
  e.preventDefault();

  const cover = document.getElementById("coverAll");

  cover.style.display = "none";
}

// listening to the click in the start game button \\
startButton.addEventListener("click", Start);

// the function responsible to get the submited guess from the input,
// format it with Format(),to then render it in screen
// and also render the tips, success and error texts.
sendGuess.addEventListener("click", () => {
  // saving the Guess in a variable to work on it.
  const guess = input.value;

  if (checkInput(guess) === false) {
    // text warnings \\
    text.style.color = "#cc3300";
    text.innerHTML = "Digite somente números, por favor.";

    // setting numbers \\
    firstNumber.setAttribute("class", "num-9");
    secondNumber.setAttribute("class", "num-9");
    thirdNumber.setAttribute("class", "num-9");

    // cleaning the input and focusing on it,so he can guess again faster and easier
    // to make a better user experience;
    input.value = "";
    input.focus();

    return;
  }

  // cleaning the input and focusing on it,so he can guess again faster and easier
  // to make a better user experience;
  input.value = "";
  input.focus();

  // checking if the number is negative or higher than 300
  if (guess < 1 || guess > 300) {
    // text warnings \\
    text.style.color = "#cc3300";
    text.innerHTML = "Escolha um número entre 1 e 300.";

    // enabling the inputs  \\
    input.disabled = true;
    sendGuess.disabled = true;

    // showing the newGame button \\
    newGame.style.display = "flex";

    return;
  }

  // checking if the guess equals to the number we got from the API \\
  if (guess == number) {
    // text warnings \\
    text.style.color = "#32bf00";
    text.innerHTML = "Você acertou!!";

    // disabling the inputs \\
    input.disabled = true;
    sendGuess.disabled = true;

    // changing the class on the numbers wrapper, so i can work it out in the css \\
    numbers.className += " success";

    // showing the newGame button \\
    newGame.style.display = "flex";
  }

  if (guess < number) {
    // text warnings \\
    text.style.color = "#cc3300";
    text.innerHTML = "É maior!!";
  }
  if (guess > number) {
    // text warnings \\
    text.style.color = "#cc3300";
    text.innerHTML = "É menor!!";
  }

  // splitting the guess in hundred / dozens / unit to show it on screen \\
  let formatedGuess = Format(guess);

  // formatedGuess will be an array, I'm rendering it in the screen by their indexes \\
  firstNumber.setAttribute("class", "num-" + formatedGuess[0]);
  secondNumber.setAttribute("class", "num-" + formatedGuess[1]);
  thirdNumber.setAttribute("class", "num-" + formatedGuess[2]);
});

// newGame function, reset classes, numbers on the screen
// and get new number from API
newGame.addEventListener("click", () => {
  // reseting text \\
  text.style.color = "#262a34";
  text.innerHTML = "Escolha um número entre 1 e 300.";

  // removing classes \\
  numbers.classList.remove("success");
  numbers.classList.remove("error");

  // getting data from API \\
  GetData();

  // enabling the inputs  \\
  input.disabled = false;
  sendGuess.disabled = false;

  // setting numbers to zeros \\
  firstNumber.setAttribute("class", "num-0");
  secondNumber.setAttribute("class", "num-0");
  thirdNumber.setAttribute("class", "num-0");

  // hidding the newGame button again \\
  newGame.style.display = "none";
});
