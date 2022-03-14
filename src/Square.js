import React from 'react'
import mimecropped from './mime-cropped.jpg';
import flag from './flag.jpg';
import "./style.css"

export default function Square({props, revealSquare, toggleMarked}) {
  function handleRightClick(){
    revealSquare(props.id);
  }

  function handleLeftClick(e){
      toggleMarked(props.id);
      e.preventDefault();
  }

  if(!props.revealed){
      if(!props.marked){
        return <td className='square' onClick={handleRightClick} onContextMenu={handleLeftClick}></td>
      }
      return <td className='square' onClick={handleRightClick} onContextMenu={handleLeftClick} style={{backgroundImage: `url(${flag})`, backgroundSize: '100%'}}></td>
  }
  if(props.revealed && props.isMime){
    return (
        <td className="square mime" onClick={handleRightClick} style={{backgroundImage: `url(${mimecropped})`, backgroundSize: '100%'}}></td>
    );
  }
  return (
    <td className="square" onClick={handleRightClick}>{props.value}</td>
  );
}

// <a href="https://www.vecteezy.com/free-vector/mime">Mime Vectors by Vecteezy</a>
