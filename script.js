// character : 5 char
// chance : 6 times
// yellow : char - OK  / Position - Not OK
// green : char - OK / Position - OK
// check if input word is in dictionary : 5 char word asset file - maybe Next...

//23.02.22 wordle
//0. User input -> capital
//1. Next Line - disabled -> enable
//2. You win / game over / Reset / restart
//3. Words list -> on game start -> answer random 
//4. check if user input is in answer words list

let answer = "plate";
const EnterButton = document.getElementById("enter");
EnterButton.addEventListener("click", CheckWord);

const youWin = document.getElementById("you_win");
const gameOver = document.getElementById("game_over");

let trialCount = 1;
let greenCount = 0;
let bUserWin = false;

const answerList = [];

reset();
readAnswerFile('./words.txt');

// read path file and log console
function readAnswerFile(path) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', path, true);
  xhr.responseType = 'text';
  xhr.onload = function() {
    lines = this.response.split('\n');

    for (var i = 0; i < lines.length; i++) {
      //console.log(lines[i]);
      answerList[i] = lines[i].trim();
    }

    let randomNumber = Math.floor(Math.random(answer) * answerList.length);
    answer = answerList[randomNumber];
    console.log("answer is " + answer);
  };
  xhr.send();
}

//for game start and restart
function reset() {
  trialCount = 1;
  greenCount = 0;
  bUserWin = false;
  youWin.style.visibility = "hidden";
  gameOver.style.visibility = "hidden";
  for (let k = 1; k < 7; k++) {
    for (let i = 1; i < 6; i++) {
      const ch = [];
      ch[i] = document.getElementById("ch" + k + i);
      ch[i].disabled = true;
      ch[i].value = "";
      ch[i].style.color = "black";
    }
  }

  //randomNumber()
  let randomNumber = Math.floor(Math.random(answer) * answerList.length);
  answer = answerList[randomNumber];
  console.log("answer is " + answer);

  EnterButton.value = "ENTER";
  openLine(1);
}

//open certain Line
function openLine(number) {
  for (let i = 1; i < 6; i++) {
    const ch = [];
    ch[i] = document.getElementById("ch" + number + i);
    ch[i].disabled = false;
  }
}

function closeLine(number) {
  for (let i = 1; i < 6; i++) {
    const ch = [];
    ch[i] = document.getElementById("ch" + number + i);
    ch[i].disabled = true;
  }
}

//this fucntion get UserAnswer as input
//if UserAnswer is in answerList, return true;
//if Not, return false
function CheckWordInAnswerList(UserAnswer) {
  let bResult = false;
  for (let i = 0; i < answerList.length; i++) {
    if (UserAnswer == answerList[i]) {
      bResult = true;
      break;
    }
  }

  if (bResult == true) {
    return true;
  }
  else {
    return false;
  }
}

function CheckWord() {

  if (bUserWin == true) {
    console.log("You win");
    reset();
    return;
  }

  if (trialCount >= 7) { //Game over
    console.log("Game Over... No more chance");
    reset();
    //break; <- only for, while
    return; //< after return, nothing happen...
  }

  const ch = [];
  ch[0] = document.getElementById("ch" + trialCount + "1");
  ch[1] = document.getElementById("ch" + trialCount + "2");
  ch[2] = document.getElementById("ch" + trialCount + "3");
  ch[3] = document.getElementById("ch" + trialCount + "4");
  ch[4] = document.getElementById("ch" + trialCount + "5");

  let UserAnswer = ch[0].value + ch[1].value + ch[2].value + ch[3].value + ch[4].value;
  console.log("USER ANSWER = " + UserAnswer.toLowerCase());
  //Check serAnswer is in answerList
  let ValidCheck = CheckWordInAnswerList(UserAnswer.toLowerCase());
  if (ValidCheck == false) //if word is not in answerlist
  {
    console.log("word is not in the answer list.");
    alert("Not in word list");
    return;
  }

  //Make All black
  for (let k = 0; k < 5; k++) {
    ch[k].style.color = "black";
  }

  //Green First
  for (let k = 0; k < 5; k++) {
    if (ch[k].value.toLowerCase() == answer[k]) {
      greenCount++;
      ch[k].style.color = "green";
    }
  }

  //check yellow
  for (let k = 0; k < 5; k++) {
    if (ch[k].style.color != "green") {
      for (let i = 0; i < 5; i++) //for i in range 5:  <- python
      {
        if (ch[i].style.color == "black") {
          if (ch[k].value.toLowerCase() == answer[i]) {
            ch[k].style.color = "yellow";
            break;
          }
        }
      }
    }
  }

  trialCount++; //-> trialCount = trialCount+1

  closeLine(trialCount - 1);


  if (greenCount == 5) {
    bUserWin = true;
    console.log("You win");
    youWin.style.visibility = "visible";
    EnterButton.value = "Restart";
  }
  else {
    if (trialCount < 7) {
      openLine(trialCount);
    }
    else if (trialCount == 7) {
      console.log("Game over");
      gameOver.style.visibility = "visible";
      EnterButton.value = "Restart";
    }
  }
}