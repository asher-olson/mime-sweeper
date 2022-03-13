import React, { useEffect, useState } from 'react'

export default function Timer({time}) {
//   const [currentTime, setTime] = useState(0);
//   useEffect(() => {
//     const interval = setInterval(() => {
//         console.log("time: " + currentTime);
//         setTime(currentTime => currentTime + 1);
//     }, 1000);
//   }, []);
  let min = Math.floor(time / 60);
  let sec = time % 60;
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
    <div className='timer'>Time: {str}</div>
  )
}
