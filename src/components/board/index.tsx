"use client";
import { useEffect } from "react";
import { motion } from "motion/react";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  moveDown,
  moveUp,
  moveLeft,
  moveRight,
  reset,
} from "@/lib/features/boardSlice";
import Board from "@/components/board/Board";
import Score from "@/components/board/Score";
import Logo from "@/components/board/Logo";
import useTouchSwipe, { SwipeDirection } from "@/lib/hooks/use-touch-swipe";
import useEndGame from "@/lib/hooks/use-end-game";

function BoardGame() {
  const score = useAppSelector((state) => state.board.score);
  const values = useAppSelector((state) => state.board.values);
  const dispatch = useAppDispatch();

  const isEndGame = useEndGame(values);

  useEffect(() => {
    dispatch(reset({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "w") {
        dispatch(moveUp());
      } else if (e.key === "ArrowDown" || e.key === "s") {
        dispatch(moveDown());
      } else if (e.key === "ArrowLeft" || e.key === "a") {
        dispatch(moveLeft());
      } else if (e.key === "ArrowRight" || e.key === "d") {
        dispatch(moveRight());
      } else if (e.key === "r") {
        dispatch(reset({}));
      } else {
        return;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch]);

  useTouchSwipe((dir) => {
    if (dir === SwipeDirection.Up) {
      dispatch(moveUp());
    } else if (dir === SwipeDirection.Down) {
      dispatch(moveDown());
    } else if (dir === SwipeDirection.Left) {
      dispatch(moveLeft());
    } else if (dir === SwipeDirection.Right) {
      dispatch(moveRight());
    } else {
      return;
    }
  });

  return (
    <section className="flex flex-col h-[100vmin] w-[100vmin] p-2 overflow-hidden relative">
      <header className="flex justify-between content-center mb-2">
        <Logo />
        <div className="flex gap-4">
          <input
            type="number"
            value={values.length}
            className="w-8 text-center appearance-none bg-inherit"
            onChange={(e) =>
              dispatch(
                reset({ size: parseInt(e.target.value) }),
                e.currentTarget.blur(),
              )
            }
          />
          <button className="text-blue-500" onClick={() => dispatch(reset({}))}>
            Restart
          </button>
          <Score value={score} />
        </div>
      </header>
      <Board values={values} />
      {isEndGame && (
        <motion.button
          className="absolute bottom-2 left-0 right-0 bg-opacity-20 flex justify-between text-red-700 bg-slate-200 p-2"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => dispatch(reset({}))}
        >
          Oh! You Lost
          <span className="font-bold text-white">Try Again</span>
        </motion.button>
      )}
    </section>
  );
}

export default BoardGame;
