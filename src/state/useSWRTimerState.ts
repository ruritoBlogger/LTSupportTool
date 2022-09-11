import useSWR from "swr";

interface useSWRTimerStateReturn {
  time: Date;
  setTime: (newTime: Date) => void;
}

export const useSWRTimerState = (initialTime: Date): useSWRTimerStateReturn => {
  const { data: time, mutate: setTime } = useSWR("timer", null, {
    fallbackData: initialTime,
  });

  return {
    time: time ?? new Date(),
    setTime: setTime,
  };
};
