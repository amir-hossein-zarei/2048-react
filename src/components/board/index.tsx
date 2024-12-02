"use client";
import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  moveDown,
  moveUp,
  moveLeft,
  moveRight,
  addRandomValue,
  reset,
} from "@/lib/features/boardSlice";
import Board from "@/components/board/Board";
import Score from "@/components/board/Score";
import Logo from "@/components/board/Logo";
import useTouchSwipe, { SwipeDirection } from "@/lib/hooks/use-touch-swipe";

function BoardGame() {
  const score = useAppSelector((state) => state.board.score);
  const values = useAppSelector((state) => state.board.values);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(reset());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        dispatch(moveUp());
      } else if (e.key === "ArrowDown") {
        dispatch(moveDown());
      } else if (e.key === "ArrowLeft") {
        dispatch(moveLeft());
      } else if (e.key === "ArrowRight") {
        dispatch(moveRight());
      } else {
        return;
      }
      dispatch(addRandomValue());
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
    }
    dispatch(addRandomValue());
  });

  return (
    <section className="flex flex-col h-[100vmin] w-[100vmin] p-2">
      <header className="flex justify-between content-center mb-2">
        <Logo />
        <div className="flex gap-4">
          <button className="text-blue-500" onClick={() => dispatch(reset())}>
            Restart
          </button>
          <Score value={score} />
        </div>
      </header>
      <Board values={values} />
    </section>
  );
}

export default BoardGame;
