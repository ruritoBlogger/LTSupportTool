import useSWR from "swr";

interface useSWRTimerStateReturn {
  time: number;
  setTime: (newTime: number) => void;
}

export const useSWRTimerState = (
  initialTime: number
): useSWRTimerStateReturn => {
  const { data: time, mutate: setTime } = useSWR("timer", null, {
    fallbackData: initialTime,
  });

  return {
    time: time ?? 0,
    setTime: setTime,
  };
};
