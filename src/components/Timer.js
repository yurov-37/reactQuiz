import { useEffect } from 'react';

export const Timer = ({ onTimerTick, secondsRemaning }) => {
  const min = String(Math.floor(secondsRemaning / 60)).padStart(2, '0');
  const seconds = String(secondsRemaning % 60).padStart(2, '0');

  useEffect(() => {
    const id = setInterval(() => {
      onTimerTick();
    }, 1000);

    return () => clearInterval(id);
  }, [onTimerTick]);
  return (
    <div className="timer">
      {min}:{seconds}
    </div>
  );
};
