import React, { useState, useEffect } from 'react';

// Reusable Length Component
const Length = ({ name, length, onIncrease, onDecrease }) => (
  <div>
    <h3>{name} Length</h3>
    <div className='flex  font-black justify-around'>
      <button className='text-[#b71c1c] text-[1.2rem] rounded-full w-[1.6rem] h-[2rem] p-[2px] bg-[whitesmoke]' onClick={onIncrease}>+</button>
      <p className='text-[1.4rem]'>{length}</p>
      <button className='text-[#b71c1c] rounded-full w-[1.6rem] h-[2rem] p-[2px] bg-[whitesmoke]' onClick={onDecrease}>-</button>
    </div> 
  </div>
);

// Control Component for Timer Controls
const Control = ({ onStartPause, onReset}) => {
  return (
    <div className='text-[max(2.5vmax,2.5em)] flex justify-center gap-5'>
     <button className='rounded-full p-[0.3rem] shadow-[5px_5px_10px_#a31919,-5px_-5px_10px_#cb1f1f]' onClick={onStartPause}>
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 56 56">
          <rect width="56" height="56" fill="none" />
          <path fill="currentColor" d="M34.543 44.733h4.481c1.737 0 2.645-.908 2.645-2.645V15.203c0-1.796-.908-2.625-2.645-2.625h-4.48c-1.738 0-2.626.908-2.626 2.625v26.885c0 1.737.888 2.645 2.625 2.645m14.35 0h4.481c1.737 0 2.626-.908 2.626-2.645V15.203c0-1.796-.889-2.625-2.626-2.625h-4.48c-1.737 0-2.645.908-2.645 2.625v26.885c0 1.737.908 2.645 2.645 2.645m-46.05-.592c.809 0 1.48-.257 2.27-.73l20.114-11.824c1.401-.83 2.013-1.816 2.013-2.941c0-1.145-.612-2.112-2.013-2.941L5.112 13.86c-.809-.474-1.46-.73-2.27-.73C1.302 13.13 0 14.315 0 16.526v24.24c0 2.21 1.303 3.375 2.842 3.375" />
        </svg>
      </button>
      <button className='rounded-full p-[0.3rem] shadow-[5px_5px_10px_#a31919,-5px_-5px_10px_#cb1f1f]' onClick={onReset}>
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <rect width="24" height="24" fill="none" />
          <path fill="currentColor" d="M9.825 20.7q-2.575-.725-4.2-2.837T4 13q0-1.425.475-2.713t1.35-2.362q.275-.3.675-.313t.725.313q.275.275.288.675t-.263.75q-.6.775-.925 1.7T6 13q0 2.025 1.188 3.613t3.062 2.162q.325.1.538.375t.212.6q0 .5-.35.788t-.825.162m4.35 0q-.475.125-.825-.175t-.35-.8q0-.3.213-.575t.537-.375q1.875-.6 3.063-2.175T18 13q0-2.5-1.75-4.25T12 7h-.075l.4.4q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-2.1-2.1q-.15-.15-.212-.325T8.55 6t.063-.375t.212-.325l2.1-2.1q.275-.275.7-.275t.7.275t.275.7t-.275.7l-.4.4H12q3.35 0 5.675 2.325T20 13q0 2.725-1.625 4.85t-4.2 2.85" />
        </svg>
      </button>
    </div>
  );
};

// Helper function for time formatting
const formatTime = (time) => `${String(Math.floor(time / 60)).padStart(2, '0')}:${String(time % 60).padStart(2, '0')}`;

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60); // Time in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true); // Track session or break
  const [reoccur, setReoccur] = useState(false); 
  const [timerId, setTimerId] = useState(null);
  const audio = document.getElementById('beep');
  // Reset Timer
  const resetTimer = () => {
    clearInterval(timerId);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setIsRunning(false);
    setIsSession(true);
  };

  // Handle start/pause
  const startPauseTimer = () => {
    if (isRunning) {               //pause
      clearInterval(timerId);
      setIsRunning(false);
    } else {                       //start
      setIsRunning(true);
      const newTimerId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 0) {
            clearInterval(newTimerId);
            audio.currentTime = 0
            audio.play()
            setIsSession(!isSession);
            setIsRunning(false);
            setReoccur(true)
            return isSession ? breakLength * 60 : sessionLength * 60;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerId(newTimerId);
    }
  };
  

  // Update timeLeft when breakLength changes
  useEffect(() => {
    if(reoccur){
      startPauseTimer()
      setReoccur(false);
    };
    if(!isRunning){
      !isSession && setTimeLeft(breakLength * 60);
    }
  }, [timeLeft,reoccur,breakLength]);
  
  // Update timeLeft when sessionLength changes
  useEffect(() => {
    
    if(!isRunning){
      isSession && setTimeLeft(sessionLength * 60)
    }
  }, [sessionLength,]);

  // Handle increase/decrease of lengths
  const changeLength = (type, amount) => {
    if (isRunning) return;
    if (type === 'break') {
      setBreakLength((prev) => Math.min(60, Math.max(1, prev + amount)));
    } else {
      setSessionLength((prev) => Math.min(60, Math.max(1, prev + amount)));
    }
  };

  return (
    <main className='text-center bg-[linear-gradient(145deg,#c41e1e,#a51919)] w-[clamp(18em,90vw,25em)] rounded-xl pt-9 pb-2 px-1'>
      <h1 className='bg-[whitesmoke] shadow-[5px_5px_10px_#a31919,-5px_-5px_10px_#cb1f1f] rounded-xl w-[85%] m-auto text-[#b71c1c] text-[max(2.7vmax,2em)]'>25 + 5 Clock</h1>
      <section className='flex justify-around pt-[4em] pb-[1em]'>
        <Length
          name="Break"
          length={breakLength}
          onIncrease={() => changeLength('break', 1)}
          onDecrease={() => changeLength('break', -1)}
        />
        <Length
          name="Session"
          length={sessionLength}
          onIncrease={() => changeLength('session', 1)}
          onDecrease={() => changeLength('session', -1)}
        />
      </section>
      <section className='py-3 shadow-[5px_5px_10px_#a31919,-5px_-5px_10px_#cb1f1f]  w-[17em] m-auto rounded-[50%]'>
        <p className='text-[max(2.7vmax,2em)]'>{isSession ? 'Session' : 'Break'}</p>
        <audio id="beep" src="https://www.pacdv.com/sounds/interface_sound_effects/sound10.mp3" type="audio/mp3"></audio>
        <p className='text-[max(5vmax,5em)]' style={{color:timeLeft<60? "rgb(165, 13, 13)":"white" }}>{formatTime(timeLeft)}</p>
        <Control  onStartPause={startPauseTimer} onReset={resetTimer} />
      </section>
      <div className='p-2 font-black'>Designed and Coded by Teaz</div>
    </main>
  );
}

export default React.memo(App);
