import { useState, useEffect } from 'react';

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    
    return { hours, minutes, seconds, ampm };
  };

  const { hours, minutes, seconds, ampm } = formatTime(time);

  return (
    <div className="digital-clock">
      <div className="time">
        <span className="hours">{hours}</span>
        <span className="colon">:</span>
        <span className="minutes">{minutes}</span>
        <span className="colon">:</span>
        <span className="seconds">{seconds}</span>
      </div>
      <div className="ampm">{ampm}</div>
    </div>
  );
}
