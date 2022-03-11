import React, { useState } from 'react';
import Board from './Board';
import Controls from './Controls';
import uuid from 'react-uuid';

var numRevealed = 0;

function App() {
  const [settings, setSettings] = useState({theme: "dark", difficulty: "medium", mimesLeft: 60});
  const [board, setBoard] = useState(generateBoard(settings.difficulty));

  const DIFFICULTIES = {"easy": 30, "medium": 60, "hard": 99};
  const TOWIN = {"easy": 138, "medium": 260, "hard": 381};
  console.log("at the top, resetting numrevealed");
  
  

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
          console.log("in helper");
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
    console.log(numRevealed);
    if(numRevealed === TOWIN[settings.difficulty]){
      win();
    }
  }

  function win(){
    // reveal a div overlayed over the screen
    alert("hold this W");
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

  function changeDifficulty(e){
    let diff = e.target.id;
    let newSettings = {theme: settings.theme, difficulty: diff, mimesLeft: DIFFICULTIES[diff]};
    setSettings(newSettings);

    let newBoard = generateBoard(diff);
    setBoard(newBoard);

    console.log("change difficulty reset");
    numRevealed = 0;
  }

  return (
    <div id="outmost" className="dark">
      <Board board={board} revealSquare={revealSquare} toggleMarked={toggleMarked} />
      <Controls settings={settings} changeDifficulty={changeDifficulty} />
    </div>
  );
}



function generateBoard(difficulty){
  if(difficulty == "easy"){
    var x = 12;
    var y = 14;
    var nMimes = 30
  }
  else if(difficulty == "medium"){
    var x = 16;
    var y = 20;
    var nMimes = 60;
  } else {
    var x = 20;
    var y = 24;
    var nMimes = 99;
  }

  var board = Array.apply(null, Array(x)).map(function () {});

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
