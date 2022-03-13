import React from 'react'

export default function Best({best}) {
    if(!best){
        return (
            <div className='timer'>Best: --:--</div>
        )
    }

    let min = Math.floor(best / 60);
    let sec = best % 60;
    let str =  "";
    if(min < 10){
        str = str + "0" + min;
    } else {
        str = str + min;
    }
    str = str + ":";
    if(sec < 10){
        str = str + "0" + sec;
    } else {
        str = str + sec;
    }
  
    return (
      <div className='timer'>Best: {str}</div>
    )
}
