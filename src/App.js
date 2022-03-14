import React, { useState, useEffect } from 'react';
import Board from './Board';
import Controls from './Controls';
import uuid from 'react-uuid';

var numRevealed = 0;
const LOCAL_STORAGE_KEY = "mimewseeper.records";
const DIFFICULTIES = {"easy": 30, "medium": 60, "hard": 99};
const TOWIN = {"easy": 138, "medium": 260, "hard": 381};
var timerInterval;

function App() {
  const [settings, setSettings] = useState({theme: "dark", difficulty: "medium", mimesLeft: 60});
  const [board, setBoard] = useState(generateBoard(settings.difficulty));
  const [time, setTime] = useState(0);
  const [bests, setBests] = useState({});
  
  useEffect(() => {
    timerInterval = setInterval(() => {
      setTime(time => time + 1);
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  useEffect(() => {
    const storedBests = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    console.log(`loading bests: ${storedBests}`);
    if (storedBests){
      console.log("bests loaded");
      setBests(storedBests);
    }
  }, []);

  useEffect(() => {
    console.log(`bests changed: ${bests}`)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bests));
  }, [bests]);

  function getSquare(id, b){
    for(let i = 0; i < b.length; i++){
      for(let j = 0; j < b[i].length; j++){
        if(b[i][j].id === id){
          return b[i][j];
        }
      }
    }
  }

  function revealSquare(id){
    const newBoard = [...board];
    const square = getSquare(id, newBoard);
    if(square.revealed){
      return;
    }

    if(square.isMime){
      lose();
    }

    // if val is 0, reveal all adjacent squares
    let zero = false;
    if(square.value === 0){
      zero = true;
      let helper = (sq) => {
        if(sq.revealed === true){
          return;
        }
        sq.revealed = true;
        numRevealed++;
        if(sq.value === 0){
          // call helper on adjacent squares
          if(sq.row - 1 >= 0){
            if(sq.col - 1 >= 0){
              helper(newBoard[sq.row - 1][sq.col - 1]);
            }
            if(sq.col + 1 < newBoard[0].length){
              helper(newBoard[sq.row - 1][sq.col + 1]);
            }
            helper(newBoard[sq.row - 1][sq.col]);
          }
          if(sq.row + 1 < newBoard.length){
            if(sq.col - 1 >= 0){
              helper(newBoard[sq.row + 1][sq.col - 1]);
            }
            if(sq.col + 1 < newBoard[0].length){
              helper(newBoard[sq.row + 1][sq.col + 1]);
            }
            helper(newBoard[sq.row + 1][sq.col]);
          }
          if(sq.col - 1 >= 0){
            helper(newBoard[sq.row][sq.col - 1]);
          }
          if(sq.col + 1 < newBoard[0].length){
            helper(newBoard[sq.row][sq.col + 1]);
          }
        }
        return;
      }
      helper(square);
    }
    if(!zero){
      square.revealed = true;
      numRevealed++;
    }
    
    setBoard(newBoard);
    if(numRevealed === TOWIN[settings.difficulty]){
      win();
    }
  }

  function toggleMarked(id){
    const newBoard = [...board];
    const square = getSquare(id, newBoard);
    square.marked = !square.marked;
    setBoard(newBoard);

    let newLeft;
    if(square.marked){
      newLeft = settings.mimesLeft - 1;
    } else {
      newLeft = settings.mimesLeft + 1;
    }

    setSettings({theme: settings.theme, difficulty: settings.difficulty, mimesLeft: newLeft});
  }

  function updateTimer(){
    setTime(time => time + 1);
  }

  function changeDifficulty(e){
    let diff = e.target.id;
    let newSettings = {theme: settings.theme, difficulty: diff, mimesLeft: DIFFICULTIES[diff]};
    setSettings(newSettings);

    let newBoard = generateBoard(diff);
    setBoard(newBoard);

    console.log("change difficulty reset");
    numRevealed = 0;

    if(timerInterval !== undefined){
      clearInterval(timerInterval);
      setTime(0);
      timerInterval = setInterval(updateTimer, 1000);
    } else {
      timerInterval = setInterval(updateTimer, 1000);
    }
    
  }

  function win(){
    // reveal a div overlayed over the screen
    clearInterval(timerInterval);

    if(bests[settings.difficulty] < time || !bests[settings.difficulty]){
      if(typeof(bests) != "object"){
        var newBests = {};
      } else {
        newBests = {...bests};
      }
      newBests[settings.difficulty] = time;
      setBests(newBests);
      console.log(`in win: bests: ${bests}`);
    }
    alert("you won in " + time + " seconds");
  }

  function lose(){
    //reveal all bombs
    const newBoard = [...board];
    for(let i = 0; i < newBoard.length; i++){
      for(let j = 0; j < newBoard[i].length; j++){
        if(newBoard[i][j].isMime){
          newBoard[i][j].revealed = true;
        }
      }
    }

    setBoard(newBoard);
    alert("YOU LOSE. click a difficulty to play again");
  }

  return (
    <>
      <div className='me-link'><a href="https://asherolson.com">Visit Me</a></div>
      <div id="outmost" className="dark">
        <Board board={board} revealSquare={revealSquare} toggleMarked={toggleMarked} />
        <Controls settings={settings} changeDifficulty={changeDifficulty} time={time} best={bests[settings.difficulty]} />
      </div>
    </>
  );
}



function generateBoard(difficulty){
  if(difficulty === "easy"){
    var x = 12;
    var y = 14;
    var nMimes = 30
  }
  else if(difficulty === "medium"){
    x = 16;
    y = 20;
    nMimes = 60;
  } else {
    x = 20;
    y = 24;
    nMimes = 99;
  }

  var board = Array.apply(null, Array(x)).map(function () {return 0;});

  for(let i = 0; i < board.length; i++){
    board[i] = Array.apply(null, Array(y)).map(function () {return 0;});
  }

  for(let i = 0; i < nMimes; i++){
    while(true){
      let ranX = getRandomInt(x);
      let ranY = getRandomInt(y);
      if(board[ranX][ranY] >= 0){
        board[ranX][ranY] = -9;

        // increment adjacent squares
        if(ranX - 1 >= 0){
          if(ranY - 1 >= 0){
            board[ranX - 1][ranY - 1]++;
          }
          if(ranY + 1 < y){
            board[ranX - 1][ranY + 1]++;
          }
          board[ranX - 1][ranY]++;
        }
        if(ranX + 1 < x){
          if(ranY - 1 >= 0){
            board[ranX + 1][ranY - 1]++;
          }
          if(ranY + 1 < y){
            board[ranX + 1][ranY + 1]++;
          }
          board[ranX + 1][ranY]++;
        }
        if(ranY - 1 >= 0){
          board[ranX][ranY - 1]++;
        }
        if(ranY + 1 < y){
          board[ranX][ranY + 1]++;
        }
        break;
      }
    }
  }

  // map each square to an object
  board = board.map((row, posx) => {
    return (
        row.map((square, posy) => {
            return {id: uuid(), isMime: square < 0, revealed: false, value: square, row: posx, col: posy, marked: false}
        })
    )
  });

  return board;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export default App;
