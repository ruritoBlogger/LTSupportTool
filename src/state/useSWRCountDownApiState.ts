import { CountdownApi } from "react-countdown";
import useSWR from "swr";

interface useSWRCountDownApiStateReturn {
  api: CountdownApi | null | undefined;
  setApi: (newApi: CountdownApi) => void;
}

export const useSWRCountDownApiState = (
  initialApi: CountdownApi | null | undefined
): useSWRCountDownApiStateReturn => {
  const { data: api, mutate: setApi } = useSWR("api", null, {
    fallbackData: initialApi,
  });

  return {
    api: api,
    setApi: setApi,
  };
};
