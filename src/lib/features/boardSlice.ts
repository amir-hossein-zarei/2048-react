import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const DEFAULT_SIZE = 4;
const DOUBLE_CHANCE = 0.3;

export type BoardState = {
  score: number;
  lastMove: number;
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
    lastMove: LastMove.MoveNone,
    values: Array(DEFAULT_SIZE)
      .fill(0)
      .map(() => Array(DEFAULT_SIZE).fill(0)),
  },
  reducers: {
    moveUp(state) {
      state.lastMove = LastMove.MoveUp;
      for (let j = 0; j < state.values.length; j++) {
        let t = 0;
        for (let i = 0; i < state.values.length; i++) {
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
      _addRandomValue(state.values);
    },
    moveDown(state) {
      state.lastMove = LastMove.MoveDown;
      for (let j = state.values.length - 1; j >= 0; j--) {
        let t = state.values.length - 1;
        for (let i = state.values.length - 1; i >= 0; i--) {
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
      _addRandomValue(state.values);
    },
    moveLeft(state) {
      state.lastMove = LastMove.MoveLeft;
      for (let i = 0; i < state.values.length; i++) {
        let t = 0;
        for (let j = 0; j < state.values.length; j++) {
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
      _addRandomValue(state.values);
    },
    moveRight(state) {
      state.lastMove = LastMove.MoveRight;
      for (let i = state.values.length - 1; i >= 0; i--) {
        let t = state.values.length - 1;
        for (let j = state.values.length - 1; j >= 0; j--) {
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
      _addRandomValue(state.values);
    },
    move(
      state,
      action: PayloadAction<{
        axisY: boolean;
        reverse: boolean;
        addRandom?: boolean;
      }>,
    ) {
      const { axisY, reverse, addRandom } = action.payload;
      const start = reverse ? 0 : state.values.length - 1;
      const end = reverse ? state.values.length - 1 : 0;
      const inc = reverse ? -1 : 1;
      state.lastMove = axisY
        ? reverse
          ? LastMove.MoveDown
          : LastMove.MoveUp
        : reverse
          ? LastMove.MoveLeft
          : LastMove.MoveRight;

      for (let i = start; i >= end; i += inc) {
        let t = start;
        for (let j = start; j >= end; j += inc) {
          const currentValue = state.values[i][j];
          if (currentValue === 0) continue;

          if (axisY && t !== i) {
            if (state.values[i][t] === 0) {
              state.values[i][j] = 0;
              state.values[i][t] = currentValue;
            } else if (state.values[i][t] === currentValue) {
              state.values[i][j] = 0;
              state.values[i][t] += 1;
              state.score += 1 << state.values[i][t];
              t += inc;
            } else {
              t += inc;
              if (j === t) continue;
              state.values[i][j] = 0;
              state.values[i][t] = currentValue;
            }
          } else if (!axisY && t !== j) {
            if (state.values[t][j] === 0) {
              state.values[i][j] = 0;
              state.values[t][j] = currentValue;
            } else if (state.values[t][j] === currentValue) {
              state.values[i][j] = 0;
              state.values[t][j] += 1;
              state.score += 1 << state.values[i][t];
              t += inc;
            } else {
              t += inc;
              if (i === t) continue;
              state.values[i][j] = 0;
              state.values[t][j] = currentValue;
            }
          }
        }
      }
      // this condition is because addRandom should be true by default
      if (addRandom !== false) _addRandomValue(state.values);
    },
    addRandomValue(state) {
      _addRandomValue(state.values);
    },
    reset(state: BoardState, action: PayloadAction<{ size?: number }>) {
      const size = action.payload.size ?? state.values.length;

      state.lastMove = LastMove.MoveNone;
      state.score = 0;
      state.values = Array(size)
        .fill(0)
        .map(() => Array(size).fill(0));
      _addRandomValue(state.values);
      _addRandomValue(state.values);
    },
  },
});

function _countEmpty(values: number[][]): number {
  let count = 0;
  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < values.length; j++) {
      if (values[i][j] === 0) count++;
    }
  }
  return count;
}

function _addRandomValue(values: number[][]) {
  const emptyValueCount = _countEmpty(values);

  const randomIndex = Math.floor(Math.random() * emptyValueCount);
  let t = 0;
  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < values.length; j++) {
      if (values[i][j] === 0) {
        if (t === randomIndex) {
          values[i][j] = Math.random() > DOUBLE_CHANCE ? 1 : 2;
          return;
        }
        t++;
      }
    }
  }
}

export function isEndGame(values: number[][]): boolean {
  if (_countEmpty(values)) {
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

export const { move, moveUp, moveDown, moveLeft, moveRight, reset } =
  boardSlice.actions;

export default boardSlice.reducer;
