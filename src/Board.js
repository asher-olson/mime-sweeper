import React from 'react';
import Square from './Square';
import uuid from 'react-uuid';

export default function Board({board, revealSquare, toggleMarked}) {
//   console.log(board)
  var rows = board.map(row => {
    return (<tr>
        {row.map(square => {
            return <Square props={square} revealSquare={revealSquare} toggleMarked={toggleMarked} />
        })}
    </tr>)
  });
  return (
    <div className="outer"><table className="board"><tbody>{rows}</tbody></table></div>
  )
}
