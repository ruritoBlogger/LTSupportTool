import { useState } from "react";
import { clearInterval } from "timers";

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
  const [_, setCurrentTimeout] = useState<NodeJS.Timeout | null>(null);
  const [countDown, setCountDown] = useState<number>(goalMinutes * 60 * 1000);

  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  const start = (): void => {
    setCurrentInterval(
      setInterval(() => {
        setCountDown((current) => current - 1000);
      }, 1000)
    );

    setCurrentTimeout(
      setTimeout(() => {
        if (currentInterval) {
          clearInterval(currentInterval);
        }
      }, minutes * 60 * 1000 + seconds * 1000)
    );
  };

  return {
    time: {
      minutes: minutes,
      seconds: seconds,
    },
    start: start,
    stop: () => {
      return;
    },
    reset: () => {
      return;
    },
  };
};
