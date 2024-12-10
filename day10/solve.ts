import fs from "fs";

const parse = (fileName: string) => {
  const input = fs.readFileSync(fileName, "utf8");

  const lines = input.split("\n");
  const grid = lines.map((line) => line.trim().split("").map(Number));

  return grid;
};

type Coordinate = [number, number];
const vectors: Coordinate[] = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const solveRecursively = (
  grid: number[][],
  y: number,
  x: number,
  visited?: Set<string>
) => {
  const nextPositions = vectors
    .map((vector) => [y + vector[0], x + vector[1]])
    .filter(
      ([nextY, nextX]) =>
        nextY >= 0 &&
        nextY < grid.length &&
        nextX >= 0 &&
        nextX < grid.length &&
        (!visited || !visited.has(`${nextY},${nextX}`)) &&
        grid[nextY][nextX] === grid[y][x] + 1
    );

  let subTotal = 0;
  for (const [nextY, nextX] of nextPositions) {
    if (visited) {
      visited.add(`${nextY},${nextX}`);
    }

    if (grid[nextY][nextX] === 9) {
      subTotal++;
    } else {
      subTotal += solveRecursively(grid, nextY, nextX, visited);
    }
  }
  return subTotal;
};

const solve = (fileName: string, part2: boolean) => {
  const grid = parse(fileName);
  const size = grid.length;

  let total = 0;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (grid[i][j] === 0) {
        total += solveRecursively(grid, i, j, part2 ? undefined : new Set());
      }
    }
  }

  return total;
};

const solve1 = (fileName: string) => solve(fileName, false);

const solve2 = (fileName: string) => solve(fileName, true);

const main = (runExampleInput: boolean) => {
  const folderPath = import.meta.url
    .replace("file://", "")
    .replace("/solve.ts", "");
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
