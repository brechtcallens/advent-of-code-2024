import fs from "fs";

const parse = (fileName: string) => {
  const input = fs.readFileSync(fileName, "utf8");

  const lines = input.split("\n");
  const grid = lines.map((line) => line.trim().split(""));

  return grid;
};

const findGuard = (grid: string[][], size: number) => {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === "^") {
        return [row, col] as const;
      }
    }
  }
  return [-1, -1] as const;
};

type DIRECTION = "^" | ">" | "v" | "<";
const vectors: Record<DIRECTION, number[]> = {
  "^": [-1, 0],
  ">": [0, 1],
  v: [1, 0],
  "<": [0, -1],
};
const rotation: Record<DIRECTION, DIRECTION> = {
  "^": ">",
  ">": "v",
  v: "<",
  "<": "^",
};

const nextPos = (
  grid: string[][],
  size: number,
  row: number,
  col: number,
  direction: DIRECTION
) => {
  const vector = vectors[direction];
  const [nextRow, nextCol] = [row + vector[0], col + vector[1]];

  if (nextRow < 0 || nextRow >= size || nextCol < 0 || nextCol >= size) {
    // If outside of bounds, it's okay to go there.
    return [nextRow, nextCol] as const;
  } else if (grid[nextRow][nextCol] === "#") {
    // When next position is a crate, return the original position (need rotation).
    return [row, col] as const;
  } else {
    // Otherwise we can continue with the next position.
    return [nextRow, nextCol] as const;
  }
};

const checkLoop = (
  grid: string[][],
  size: number,
  startRow: number,
  startCol: number
) => {
  const visits = new Set<string>();

  let [row, col] = [startRow, startCol];
  let direction: DIRECTION = "^";
  while (0 <= col && col < size && 0 <= row && row < size) {
    if (visits.has(`${row},${col},${direction}`)) {
      return true;
    }

    visits.add(`${row},${col},${direction}`);
    const [nextRow, nextCol] = nextPos(grid, size, row, col, direction);
    if (nextRow === row && nextCol === col) {
      // Rotate!
      direction = rotation[direction];
    } else {
      // Go!
      row = nextRow;
      col = nextCol;
    }
  }
  return false;
};

const findAllVisits = (
  grid: string[][],
  size: number,
  startRow: number,
  startCol: number
) => {
  const visits = new Set<string>();

  let [row, col] = [startRow, startCol];
  let direction: DIRECTION = "^";
  while (0 <= col && col < size && 0 <= row && row < size) {
    visits.add(`${row},${col}`);

    const [nextRow, nextCol] = nextPos(grid, size, row, col, direction);
    if (nextRow === row && nextCol === col) {
      // Rotate!
      direction = rotation[direction];
    } else {
      // Go!
      row = nextRow;
      col = nextCol;
    }
  }

  return [...visits];
};

const solve1 = (fileName: string) => {
  const grid = parse(fileName);
  const size = grid.length;

  let [row, col] = findGuard(grid, size);
  const visits = findAllVisits(grid, size, row, col);

  return visits.length;
};

const solve2 = (fileName: string) => {
  let grid = parse(fileName);
  const size = grid.length;

  let counter = 0;
  let [row, col] = findGuard(grid, size);
  const visits = findAllVisits(grid, size, row, col);
  for (const visit of visits) {
    const [i, j] = visit.split(",").map(Number);
    if (!(i === row && j === col) && grid[i][j] !== "#") {
      grid[i][j] = "#";
      if (checkLoop(grid, size, row, col)) {
        counter++;
      }
      grid[i][j] = ".";
    }
  }

  return counter;
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
