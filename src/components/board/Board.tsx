import { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { isEndGame, LastMove, reset } from "@/lib/features/boardSlice";
import { motion } from "motion/react";

export type BoardProps = {
  values: number[][];
};

function Board(props: BoardProps) {
  const { values } = props;
  const size = values.length;
  const size2 = size ** 2;

  const dispatch = useAppDispatch();
  const isEnd = useMemo(() => {
    return isEndGame(values);
  }, [values]);

  return (
    <div
      className="grid gap-2 flex-1 overflow-hidden select-none relative"
      style={{
        gridTemplateColumns: `repeat(${size}, 1fr)`,
      }}
    >
      {isEnd && (
        <motion.button
          className="absolute bottom-2 left-0 right-0 bg-opacity-20 flex justify-between text-red-700 bg-slate-200 p-2"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => dispatch(reset())}
        >
          Oh! You Are Lost
          <span className="font-bold text-white">Try Again</span>
        </motion.button>
      )}
      {values.map((row, i) =>
        row.map((value, j) => (
          <Box key={i * size + j} max={size2} value={value} />
        )),
      )}
    </div>
  );
}

function Box(props: { value: number; max: number }) {
  const lastMove = useAppSelector((state) => state.board.lastMove);
  const [value, setValue] = useState(props.value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const deg = (value / props.max) * 360;
      if (value !== props.value) {
        if (lastMove == LastMove.MoveLeft)
          ref.current.style.transform = `translateX(-100%)`;
        else if (lastMove == LastMove.MoveRight)
          ref.current.style.transform = `translateX(100%)`;
        else if (lastMove == LastMove.MoveUp)
          ref.current.style.transform = `translateY(-100%)`;
        else if (lastMove == LastMove.MoveDown)
          ref.current.style.transform = `translateY(100%)`;
        setValue(props.value);
      } else {
        ref.current.style.transform = ``;
      }

      if (deg <= 0) ref.current.style.backgroundColor = "";
      else ref.current.style.backgroundColor = `hsl(${deg}, 80%, 50%)`;
      if (deg > 150) ref.current.style.color = "white";
      else ref.current.style.color = "black";
    }
  }, [ref, value, lastMove, setValue, props.value, props.max]);

  return (
    <motion.div
      className="flex items-center justify-center text-2xl rounded-md transition-transform duration-100"
      ref={ref}
    >
      {value ? 1 << value : ""}
    </motion.div>
  );
}

export default Board;
