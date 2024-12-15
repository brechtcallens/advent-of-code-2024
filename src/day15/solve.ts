import fs from "fs";

const parse = (fileName: string) => {
  const input = fs.readFileSync(fileName, "utf8");

  const [rawGrid, rawMoves] = input.split("\n\n");
  const grid = rawGrid.split("\n").map((line) => line.split(""));
  const moves = rawMoves.split("\n").join("").split("") as Move[];

  let startPosition: NumberPair = [0, 0];
  for (const [y, line] of grid.entries()) {
    for (const [x, char] of line.entries()) {
      if (char === "@") {
        startPosition = [y, x];
      }
    }
  }

  return { moves, grid, startPosition };
};

const parseDouble = (fileName: string) => {
  const input = fs.readFileSync(fileName, "utf8");

  const [rawGrid, rawMoves] = input.split("\n\n");
  const grid = rawGrid
    .split("\n")
    .map((line) =>
      line
        .split("")
        .flatMap((char) =>
          char === "O" ? ["[", "]"] : char === "@" ? ["@", "."] : [char, char]
        )
    );
  const moves = rawMoves.split("\n").join("").split("") as Move[];

  let startPosition: NumberPair = [0, 0];
  for (const [y, line] of grid.entries()) {
    for (const [x, char] of line.entries()) {
      if (char === "@") {
        startPosition = [y, x];
      }
    }
  }

  return { moves, grid, startPosition };
};

type NumberPair = [number, number];
type Move = "^" | ">" | "v" | "<";
const moveToVector: Record<Move, NumberPair> = {
  "^": [-1, 0],
  ">": [0, 1],
  v: [1, 0],
  "<": [0, -1],
};

const moveOnce = (
  grid: string[][],
  position: NumberPair,
  vector: NumberPair
): NumberPair => [position[0] + vector[0], position[1] + vector[1]];

const findEmptyPositionInDirection = (
  grid: string[][],
  position: NumberPair,
  vector: NumberPair
): NumberPair | false => {
  let [nextRow, nextCol] = [position[0] + vector[0], position[1] + vector[1]];
  while (grid[nextRow][nextCol] === "O") {
    [nextRow, nextCol] = [nextRow + vector[0], nextCol + vector[1]];
  }
  if (grid[nextRow][nextCol] === ".") {
    return [nextRow, nextCol];
  }
  return false;
};

const solve1 = (fileName: string) => {
  const { grid, moves, startPosition } = parse(fileName);
  let position = startPosition;
  for (const move of moves) {
    // console.log(`Move: ${move}`);

    const vector = moveToVector[move];
    const nextEmptyPosition = findEmptyPositionInDirection(
      grid,
      position,
      vector
    );
    if (nextEmptyPosition) {
      const nextPosition = moveOnce(grid, position, vector);
      // If next position is not equal to next empty position, we need to move a box to the empty one.
      if (
        nextPosition[0] !== nextEmptyPosition[0] ||
        nextPosition[1] !== nextEmptyPosition[1]
      ) {
        grid[nextEmptyPosition[0]][nextEmptyPosition[1]] = "O";
      }
      // Move to the direct next position and reset the position we were in.
      grid[position[0]][position[1]] = ".";
      grid[nextPosition[0]][nextPosition[1]] = "@";

      position = nextPosition;
    }

    // console.log(grid.map((line) => line.join("")).join("\n") + "\n");
  }

  let total = 0;
  for (const [y, line] of grid.entries()) {
    for (const [x, char] of line.entries()) {
      if (char === "O") {
        total += y * 100 + x;
      }
    }
  }

  return total;
};

const canMoveRecursively = (
  grid: string[][],
  position: NumberPair,
  vector: NumberPair,
  positionHistory: Set<string>
): boolean => {
  const key = `${position[0]},${position[1]}`;
  if (positionHistory.has(key)) {
    return true;
  }
  positionHistory.add(key);

  const [nextRow, nextCol] = [position[0] + vector[0], position[1] + vector[1]];
  const nextCharacter = grid[nextRow][nextCol];
  if (nextCharacter === ".") {
    return true;
  } else if (nextCharacter === "#") {
    return false;
  } else {
    if (vector[0] === 0) {
      // If horizontal, just check the next one.
      return canMoveRecursively(
        grid,
        [nextRow, nextCol],
        vector,
        positionHistory
      );
    } else {
      // If vertical, check both parts of the box recursively.
      const [otherNextRow, otherNextCol] = [
        nextRow,
        nextCharacter === "[" ? nextCol + 1 : nextCol - 1,
      ];
      return (
        canMoveRecursively(grid, [nextRow, nextCol], vector, positionHistory) &&
        canMoveRecursively(
          grid,
          [otherNextRow, otherNextCol],
          vector,
          positionHistory
        )
      );
    }
  }
};

const solve2 = (fileName: string) => {
  const { grid, moves, startPosition } = parseDouble(fileName);
  let position = startPosition;
  for (const move of moves) {
    // console.log(`Move: ${move}`);

    const vector = moveToVector[move];
    const history = new Set<string>();
    const canMove = canMoveRecursively(grid, position, vector, history);
    if (canMove) {
      const positionHistory = [...history].map((key) =>
        key.split(",").map(Number)
      ) as NumberPair[];

      if (move === "<") {
        positionHistory.sort((p1, p2) => p1[1] - p2[1]);
      } else if (move === ">") {
        positionHistory.sort((p1, p2) => p2[1] - p1[1]);
      } else if (move === "^") {
        positionHistory.sort((p1, p2) => {
          if (p1[0] === p2[0]) {
            return p1[1] - p2[1];
          } else {
            return p1[0] - p2[0];
          }
        });
      } else if (move === "v") {
        positionHistory.sort((p1, p2) => {
          if (p1[0] === p2[0]) {
            return p1[1] - p2[1];
          } else {
            return p2[0] - p1[0];
          }
        });
      }
      // console.log(move, positionHistory);

      for (const position of positionHistory) {
        const [nextRow, nextCol] = moveOnce(grid, position, vector);
        grid[nextRow][nextCol] = grid[position[0]][position[1]];
        grid[position[0]][position[1]] = ".";
      }
      position = moveOnce(grid, position, vector);
    }

    // console.log(grid.map((line) => line.join("")).join("\n") + "\n");
  }

  let total = 0;
  for (const [y, line] of grid.entries()) {
    for (const [x, char] of line.entries()) {
      if (char === "[") {
        total += y * 100 + x;
      }
    }
  }

  return total;
};

const main = (runExampleInput: boolean) => {
  const folderPath = import.meta.url
    .replace("file://", "")
    .replace(/solve\.(js|ts)/, "");
  const filename = `${folderPath}/${
    runExampleInput ? "example_input" : "input"
  }`;
  console.log(`Solving ${runExampleInput ? "example" : "real"} input`);
  const funcs = [solve1, solve2];
  for (const func of funcs) {
    const startTime = performance.now();
    const task1 = func(filename);
    const endTime = performance.now();
    console.log(
      `${func.name}: ${task1} (runtime: ${
        Math.round(endTime - startTime) / 1000
      } seconds)`
    );
  }
};

// Run!
const RUN_EXAMPLE_INPUT = process.argv[2] === "example";
main(RUN_EXAMPLE_INPUT);
