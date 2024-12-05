import { motion, MotionConfig, Variants } from "motion/react";

import { useAppSelector } from "@/lib/hooks";
import { LastMove } from "@/lib/features/boardSlice";
import usePrevious from "@/lib/hooks/use-previous";

export type BoardProps = {
  values: number[][];
  children?: React.ReactNode;
};

function Board(props: BoardProps) {
  const { values, children } = props;
  const size = values.length;
  const max_value = size ** 2;
  const variants: Variants = {
    MoveLeft: { x: -20, transitionEnd: { x: 0 } },
    MoveRight: { x: 20, transitionEnd: { x: 0 } },
    MoveUp: { y: -20, transitionEnd: { y: 0 } },
    MoveDown: { y: 20, transitionEnd: { y: 0 } },
    MoveNone: {},
  };

  const lastMove = useAppSelector((state) => state.board.lastMove);
  const lastValues = usePrevious(values);

  return (
    <div
      className="grid gap-2 flex-1 select-none overflow-hidden"
      style={{
        gridTemplateColumns: `repeat(${size}, 1fr)`,
      }}
    >
      <MotionConfig transition={{ duration: 0.1, ease: "linear" }}>
        {values.map((row, i) =>
          row.map((value, j) => {
            const lastValue = lastValues[i][j];
            const deg = (value / max_value) * 360;
            const background = deg ? `hsl(${deg}, 80%, 50%)` : "";
            const color = deg > 150 ? "white" : "black";

            return (
              <motion.div
                key={i * size + j}
                initial={false}
                variants={variants}
                animate={value === lastValue ? "MoveNone" : LastMove[lastMove]}
                className="flex items-center justify-center text-2xl rounded-md"
                style={{ background, color }}
              >
                {value ? 1 << value : ""}
              </motion.div>
            );
          }),
        )}
      </MotionConfig>
      {children}
    </div>
  );
}

export default Board;
