import React from 'react';
import DifficultyDisplay from './DifficultyDisplay';
import Timer from './Timer'
import Best from './Best';

export default function Controls({settings, changeDifficulty, time, best}) {
  return (
    <div className="controls">
        <DifficultyDisplay difficulty={settings.difficulty} changeDifficulty={changeDifficulty} />
        <div id="mimesLeft">{settings.mimesLeft} <span style={{fontSize: "40px"}}>mimes left</span></div>
        <Timer time={time}/>
        <Best best={best}/>
        {/* <div className="theme">
            <div>Dark mode</div>
            <label className="switch">
                <input type="checkbox"/>
                <span className="slider round"></span>
            </label>
        </div> */}
    </div>
  )
}
