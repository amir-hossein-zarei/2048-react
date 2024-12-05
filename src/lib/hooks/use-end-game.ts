import { useMemo } from "react";
import { isEndGame } from "../features/boardSlice";

function useEndGame(values: number[][]) {
  const isEnd = useMemo(() => {
    return isEndGame(values);
  }, [values]);
  return isEnd;
}

export default useEndGame;
