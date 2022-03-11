import React from 'react'

export default function DifficultyDisplay({difficulty, changeDifficulty}) {
  if(difficulty === "easy"){
    return(<div>
        <div id="easy" className='difficulty active' onClick={changeDifficulty}>Easy</div>
        <div id="medium" className='difficulty' onClick={changeDifficulty}>Medium</div>
        <div id="hard" className='difficulty' onClick={changeDifficulty}>Mega Mime Mode</div>
    </div>)
  }
  else if(difficulty === "medium"){
    return(<div>
        <div id="easy" className='difficulty' onClick={changeDifficulty}>Easy</div>
        <div id="medium" className='difficulty active' onClick={changeDifficulty}>Medium</div>
        <div id="hard" className='difficulty' onClick={changeDifficulty}>Mega Mime Mode</div>
    </div>)
  }
  return (
    <div>
        <div id="easy" className='difficulty' onClick={changeDifficulty}>Easy</div>
        <div id="medium" className='difficulty' onClick={changeDifficulty}>Medium</div>
        <div id="hard" className='difficulty active' onClick={changeDifficulty}>Mega Mime Mode</div>
    </div>)
}
