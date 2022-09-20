import { useState } from "react";

interface useCountdownReturn {
  time: {
    minutes: number;
    seconds: number;
  };
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export const useCountdown = (goalMinutes: number): useCountdownReturn => {
  const [currentInterval, setCurrentInterval] = useState<NodeJS.Timer | null>(
    null
  );
  const [currentTimeout, setCurrentTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [countDown, setCountDown] = useState<number>(goalMinutes * 60 * 1000);

  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  const start = (): void => {
    const interval = setInterval(() => {
      setCountDown((current) => current - 1000);
    }, 1000);
    setCurrentInterval(interval);

    const timeout = setTimeout(() => {
      if (currentInterval) {
        clearInterval(currentInterval);
      }
    }, minutes * 60 * 1000 + seconds * 1000);
    setCurrentTimeout(timeout);
  };

  const stop = (): void => {
    if (currentInterval) {
      clearInterval(currentInterval);
      setCurrentInterval(null);
    }
    if (currentTimeout) {
      clearTimeout(currentTimeout);
      setCurrentTimeout(null);
    }
  };

  const reset = (): void => {
    if (currentInterval) {
      clearInterval(currentInterval);
      setCurrentInterval(null);
    }
    if (currentTimeout) {
      clearTimeout(currentTimeout);
      setCurrentTimeout(null);
    }
    setCountDown(goalMinutes * 60 * 1000);
  };

  return {
    time: {
      minutes: minutes,
      seconds: seconds,
    },
    start: start,
    stop: stop,
    reset: reset,
  };
};
