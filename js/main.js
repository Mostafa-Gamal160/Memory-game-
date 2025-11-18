// onload the page
window.onload = loadStorage;

// variables
let startBtn = document.querySelector(".control-buttons span");
let personName = document.querySelector(".info-container .name span");
let startScr = document.querySelector(".control-buttons");
let blockContainer = document.querySelector(".blocks-container");
let blocks = Array.from(blockContainer.children);
let timer = document.querySelector(".info-container .timer span");
let tries = document.querySelector(".info-container .tries span");
let endGame = document.querySelector(".end-game");
let endGameSpan = document.querySelector(".end-game span");
let leaderContainer = document.querySelector(".leader-board");
let leaders = document.querySelector(".leader-board .member-info");

// publish the count down
let countDown;
// publish the time
let time;
let minutes;

// handle the start screen
startBtn.onclick = startScreen;

// function of the start screen
function startScreen() {
  let yourName = prompt("Enter Your Name");

  // set name as unknown
  if (yourName == null || yourName == "") {
    personName.innerHTML = "unknown";
  } else {
    // set name with value of yourName
    personName.innerHTML = yourName;
  }

  // remove the start screen to start playing
  startScr.remove();

  // start the timer
  Counter();

  // start the music
  document.getElementById("background").play();
}

// set the duration for appear the card
let duration = 1000;

// get the index of blocks
let orderRange = [...Array(blocks.length).keys()];

// shuffle the index
shuffle(orderRange);

// Add the order to block
blocks.forEach((block, index) => {
  // set the attribute to blocks
  block.style.order = orderRange[index];

  // call the flip block function
  block.addEventListener("click", function () {
    flipBlock(block);
  });
});

//flipped function
function flipBlock(selectedBlock) {
  // add class flip to the block
  selectedBlock.classList.add("is-flipped");

  // get access to flipped block
  let flippedBlocks = blocks.filter((flippedBlock) =>
    flippedBlock.classList.contains("is-flipped")
  );

  if (flippedBlocks.length == 2) {
    // stop the clicking
    stopClick();

    // check matched block function
    checkMatchedBlocks(flippedBlocks[0], flippedBlocks[1]);
  }
}

// handle the stop click function
function stopClick() {
  // add the no click class to the container
  blockContainer.classList.add("no-clicking");

  // remove the class after the duration
  setTimeout(() => {
    blockContainer.classList.remove("no-clicking");
  }, duration);
}

// handle the match function
function checkMatchedBlocks(firstBlock, secondBlock) {
  if (firstBlock.dataset.technology === secondBlock.dataset.technology) {
    // remove the is flipped class
    firstBlock.classList.remove("is-flipped");
    secondBlock.classList.remove("is-flipped");

    // add the has match class
    firstBlock.classList.add("has-match");
    secondBlock.classList.add("has-match");

    // play the success sound
    document.getElementById("success").play();
  } else {
    tries.innerHTML = parseInt(tries.innerHTML) + 1;

    setTimeout(() => {
      // remove the is flipped class
      firstBlock.classList.remove("is-flipped");
      secondBlock.classList.remove("is-flipped");
    }, duration);

    // play the fail sound
    document.getElementById("fail").play();
  }

  // access to card that has (has-match) class
  let matchCard = blocks.filter((matchBlock) =>
    matchBlock.classList.contains("has-match")
  );
  if (matchCard.length === blocks.length) {
    // make the background song to stop
    document.getElementById("fail").pause();

    // stop the timer
    clearInterval(countDown);

    // make the member to show in the leader board
    storage();
  }
}

function shuffle(array) {
  // set the variables
  let current = array.length,
    temp,
    random;

  // shuffle process
  while (current > 0) {
    // get random number
    random = Math.floor(Math.random() * current);

    // decrease the current to prevent the inf loop
    current--;

    // save the current ele in temp
    temp = array[current];
    // change the current ele with rand ele
    array[current] = array[random];
    // change the random ele with saved ele
    array[random] = temp;
  }
  // return the array
  return array;
}

// handle the timer
function Counter() {
  minutes = 5;
  time = minutes * 60;

  countDown = setInterval(() => {
    let mins = Math.floor(time / 60);
    let secs = time % 60;

    mins = mins < 10 ? "0" + mins : mins;
    secs = secs < 10 ? "0" + secs : secs;

    timer.innerHTML = `${mins}:${secs}`;

    if (time <= 0) {
      clearInterval(countDown);

      // make the end game screen to appear
      endGame.style.visibility = "visible";
      endGameSpan.innerHTML = "End of time";
    }

    time--;
  }, duration);
}

// handle the leader board
function storage() {
  // handle the time
  let total = minutes * 60
  let used = total - time;

  let usedMinutes = Math.floor(used / 60)
  let usedSeconds = used % 60;
  
  if (usedMinutes < 10) usedMinutes = '0' + usedMinutes;
  if (usedSeconds < 10) usedSeconds = '0' + usedSeconds;

  let finalTime = `${usedMinutes}:${usedSeconds}`
  
    // set the value of the name in the local storage
    window.localStorage.setItem("name", personName.innerHTML);
  window.localStorage.setItem("time", finalTime);

  // call the load function
  loadStorage();
}

function loadStorage() {
  // get the values from the local storage
  let getName = window.localStorage.getItem("name");
  let getScore = window.localStorage.getItem("time");

  // if the storage was empty
  if (!getName || !getScore) return;

  // make the leader board to appear
  leaderContainer.style.visibility = "visible";
  // create the element
  let member = document.createElement("div");
  let nameDiv = document.createElement("div");
  let scoreDiv = document.createElement("div");

  // add class to the element
  nameDiv.classList.add("name");
  scoreDiv.classList.add("score");
  member.classList.add("member");

  // create the text for the element
  let nameText = document.createTextNode(getName);
  let scoreText = document.createTextNode(getScore);

  // append the text and the element
  nameDiv.append(nameText);
  scoreDiv.append(scoreText);
  member.append(nameDiv);
  member.append(scoreDiv);
  leaders.append(member);
}
