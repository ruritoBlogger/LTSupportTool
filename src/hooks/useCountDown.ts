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

// @url: https://blog.greenroots.info/how-to-create-a-countdown-timer-using-react-hooks
export const useCountdown = (targetDate: number): useCountdownReturn => {
  const [currentInterval, setCurrentInterval] = useState<NodeJS.Timer | null>(
    null
  );
  const [, setCurrentTimeout] = useState<NodeJS.Timeout | null>(null);

  const countDownDate = new Date(targetDate).getTime();

  const [countDown, setCountDown] = useState<number>(
    countDownDate - new Date().getTime()
  );
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  const start = () => {
    setCurrentInterval(
      setInterval(() => {
        setCountDown(countDownDate - new Date().getTime());
      }, 1000)
    );

    setCurrentTimeout(
      setTimeout(() => {
        if (currentInterval) {
          clearInterval(currentInterval);
        }
      }, minutes * 60 + seconds)
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
