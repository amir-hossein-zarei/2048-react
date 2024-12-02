import { createSlice } from "@reduxjs/toolkit";

const DEFAULT_SIZE = 4;
const DOUBLE_CHANCE = 0.3;

export type BoardState = {
  score: number;
  size: number;
  values: number[][];
};

export enum LastMove {
  MoveNone,
  MoveLeft,
  MoveUp,
  MoveRight,
  MoveDown,
}

export const boardSlice = createSlice({
  name: "counter",
  initialState: {
    score: 0,
    size: DEFAULT_SIZE,
    lastMove: LastMove.MoveNone,
    values: Array(DEFAULT_SIZE)
      .fill(0)
      .map(() => Array(DEFAULT_SIZE).fill(0)),
  },
  reducers: {
    moveUp(state) {
      state.lastMove = LastMove.MoveUp;
      for (let j = 0; j < state.size; j++) {
        let t = 0;
        for (let i = 0; i < state.size; i++) {
          const currentValue = state.values[i][j];
          if (t === i || currentValue === 0) continue;

          if (state.values[t][j] === 0) {
            state.values[i][j] = 0;
            state.values[t][j] = currentValue;
          } else if (state.values[t][j] === currentValue) {
            state.values[i][j] = 0;
            state.values[t][j] += 1;
            state.score += 1 << state.values[t][j];
            t++;
          } else {
            t += 1;
            if (t === i) continue;
            state.values[i][j] = 0;
            state.values[t][j] = currentValue;
          }
        }
      }
    },
    moveDown(state) {
      state.lastMove = LastMove.MoveDown;
      for (let j = state.size - 1; j >= 0; j--) {
        let t = state.size - 1;
        for (let i = state.size - 1; i >= 0; i--) {
          const currentValue = state.values[i][j];
          if (t === i || currentValue === 0) continue;

          if (state.values[t][j] === 0) {
            state.values[i][j] = 0;
            state.values[t][j] = currentValue;
          } else if (state.values[t][j] === currentValue) {
            state.values[i][j] = 0;
            state.values[t][j] += 1;
            state.score += 1 << state.values[t][j];
            t--;
          } else {
            t -= 1;
            if (t === i) continue;
            state.values[i][j] = 0;
            state.values[t][j] = currentValue;
          }
        }
      }
    },
    moveLeft(state) {
      state.lastMove = LastMove.MoveLeft;
      for (let i = 0; i < state.size; i++) {
        let t = 0;
        for (let j = 0; j < state.size; j++) {
          const currentValue = state.values[i][j];
          if (t === j || currentValue === 0) continue;

          if (state.values[i][t] === 0) {
            state.values[i][j] = 0;
            state.values[i][t] = currentValue;
          } else if (state.values[i][t] === currentValue) {
            state.values[i][j] = 0;
            state.values[i][t] += 1;
            state.score += 1 << state.values[i][t];
            t++;
          } else {
            t += 1;
            if (j === t) continue;
            state.values[i][j] = 0;
            state.values[i][t] = currentValue;
          }
        }
      }
    },
    moveRight(state) {
      state.lastMove = LastMove.MoveRight;
      for (let i = state.size - 1; i >= 0; i--) {
        let t = state.size - 1;
        for (let j = state.size - 1; j >= 0; j--) {
          const currentValue = state.values[i][j];
          if (t === j || currentValue === 0) continue;

          if (state.values[i][t] === 0) {
            state.values[i][j] = 0;
            state.values[i][t] = currentValue;
          } else if (state.values[i][t] === currentValue) {
            state.values[i][j] = 0;
            state.values[i][t] += 1;
            state.score += 1 << state.values[i][t];
            t--;
          } else {
            t -= 1;
            if (j === t) continue;
            state.values[i][j] = 0;
            state.values[i][t] = currentValue;
          }
        }
      }
    },
    reset(state) {
      state.lastMove = LastMove.MoveNone;
      state.score = 0;
      state.values = Array(DEFAULT_SIZE)
        .fill(0)
        .map(() => Array(DEFAULT_SIZE).fill(0));
      _addRandomValue(state);
      _addRandomValue(state);
    },
    addRandomValue: _addRandomValue,
  },
});

function countEmpty(values: number[][]): number {
  let count = 0;
  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < values.length; j++) {
      if (values[i][j] === 0) count++;
    }
  }
  return count;
}

function _addRandomValue(state: BoardState) {
  const emptyValueCount = countEmpty(state.values);

  const randomIndex = Math.floor(Math.random() * emptyValueCount);
  let t = 0;
  for (let i = 0; i < state.size; i++) {
    for (let j = 0; j < state.size; j++) {
      if (state.values[i][j] === 0) {
        if (t === randomIndex) {
          state.values[i][j] = Math.random() > DOUBLE_CHANCE ? 1 : 2;
          return;
        }
        t++;
      }
    }
  }
}

export function isEndGame(values: number[][]): boolean {
  if (countEmpty(values)) {
    return false;
  }
  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < values.length; j++) {
      if (
        values[i][j] === values[i + 1]?.[j] ||
        values[i][j] === values[i - 1]?.[j] ||
        values[i][j] === values[i][j + 1] ||
        values[i][j] === values[i][j - 1]
      ) {
        return false;
      }
    }
  }
  return true;
}

export const { moveUp, moveDown, moveLeft, moveRight, addRandomValue, reset } =
  boardSlice.actions;

export default boardSlice.reducer;
