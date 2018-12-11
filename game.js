
let word;
let letter = "";
let lifes;;
let hints;
let numberOfHints;
let allreadyCheckedLetters;



apiCall();
prepareInitialConditions();
prepareBoardForGame(word);
initLife();

document.getElementById('surrender').addEventListener('click', surrender);
document.getElementById('restart').addEventListener('click', restart);
document.getElementById('hintsButton').addEventListener('click', showhints);
document.getElementById('oneLetter').addEventListener('click', function() {
  letter = document.getElementById('letter').value;
  checkLetter(letter);
});

document.getElementById('fullWord').addEventListener('click', function() {
  wordToCheck = document.getElementById('word').value;
  checkWord(wordToCheck);
});


function apiCall() {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // console.log(this.responseText);
      let response = JSON.parse(this.responseText);

      hints.push(response.results[0].definition);
      hints.push(response.results[1].definition);

      console.log(hints);
    };
  }

  xhttp.open("GET", createRequestPath(), true);
  xhttp.setRequestHeader("X-RapidAPI-Key", "a2a34e48edmsh5882b983f7f79ecp1b1942jsnae02eacbf482");
  xhttp.send();
}

function createRequestPath() {
  let path = "https://wordsapiv1.p.mashape.com/words/" + findWord();
  return path;
}

function findWord() {
  word = arrayOfWords[Math.floor(Math.random() * arrayOfWords.length + 0)];
  wordLetters = [...word];
  return word;
}

function checkLetter(letter) {
  if (lifes == 1) {
    alert("You lost , word- " + word.toUpperCase() + " was to hard for you ");
    document.getElementById('gameboard').innerHTML = word;
  }

  if (wordLetters.howManySameLetters(letter) > 1) {
    // console.log("lol");
    let a = wordLetters.indexOf(letter);
    let b = wordLetters.lastIndexOf(letter);
    let c = wordLetters.lastIndexOf(letter, b + 1);
    document.getElementsByTagName('span')[a].innerHTML = letter;
    document.getElementsByTagName('span')[b].innerHTML = letter;

    if (c !== -1) {
      document.getElementsByTagName('span')[c].innerHTML = letter;
    }
    document.getElementById('resultsDiv').innerHTML = "Good choice, we have " + letter.toUpperCase() + " !";

  } else if (allreadyCheckedLetters.includes(letter)) {
    document.getElementById('communicateOne').innerHTML = "You allready checked it ";
    printCheckedLetters();

  } else if (wordLetters.includes(letter) == true) {
    allreadyCheckedLetters.push(letter);
    let index = wordLetters.indexOf(letter);
    document.getElementsByTagName('span')[index].innerHTML = letter;
    document.getElementById('resultsDiv').innerHTML = "Good choice, we have " + letter.toUpperCase() + " !";
    clearCommunicats();
    printCheckedLetters();
  } else {
    allreadyCheckedLetters.push(letter);
    clearCommunicats();
    printCheckedLetters();
    document.getElementById('resultsDiv').innerHTML = "Try again :( ";
    reduceLife();
  }
}

Array.prototype.howManySameLetters = function(letter) {
  let counter = 0;
  for (let i = 1; i < this.length; i++) {
    if (this[i] == letter)
      counter++;
  }
  return counter;
}

function checkWord(wordToCheck) {
  if (word == wordToCheck) {
    alert("You Won!");
    document.getElementById('gameboard').innerHTML = word;
  } else {
    document.getElementById('resultsDiv').innerHTML = "Try again :( ";
    reduceLife();
  }
}

function clearCommunicats() {
  document.getElementById('communicateOne').innerHTML = "";
}


function printCheckedLetters() {
  document.getElementById('checked').innerHTML = allreadyCheckedLetters;
  console.log("Checked letters " + allreadyCheckedLetters);
}

function reduceLife() {
  lifes--;
  document.getElementById('lifesLeft').innerHTML = "You have " + lifes + " lifes left";

}

function initLife() {
  lifes = Math.floor(word.length * 1.5);
  console.log(lifes);
}

function restart() {

  apiCall();
  prepareInitialConditions();
  prepareBoardForGame(word);
  initLife();

}

function surrender() {
  alert("You lost , word- " + word.toUpperCase() + " was to hard for you ");
  apiCall();
  prepareInitialConditions();
  prepareBoardForGame(word);
  initLife();
}

function prepareInitialConditions() {
  hints = [];
  numberOfHints = 2;
  allreadyCheckedLetters = [];
  document.getElementById('checked').innerHTML = "";
  document.getElementById('gameboard').innerHTML = "";
  document.getElementById('resultsDiv').innerHTML = "Good luck ! ";
  document.getElementById('definitionOne').innerHTML = "";
  document.getElementById('definitionTwo').innerHTML = "";
  document.getElementById('lifesLeft').innerHTML = "";
}

function showhints() {
  reduceLife();
  if (numberOfHints == 2) {
    document.getElementById('definitionOne').innerHTML = "1. " + hints[0];
    numberOfHints--;
  } else if (numberOfHints == 1) {
    document.getElementById('definitionTwo').innerHTML = "2. " + hints[1];
    numberOfHints--;
  } else {
    document.getElementById('noMoreHints').innerHTML = "No more hints";
  }
}

function prepareBoardForGame(word) {

  let element = document.getElementById('gameboard');

  for (let i = 0; i < word.length; i++) {

    let span = document.createElement('span');
    let node = document.createTextNode("_ ");
    span.appendChild(node);
    element.appendChild(span);
  }
}
