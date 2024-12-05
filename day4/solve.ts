import fs from "fs";

const parse = (fileName: string) => {
  const input = fs.readFileSync(fileName, "utf8");

  const lines = input.split("\n");
  const grid = lines.map((line) => Object.values(line));

  return grid;
};

const checkLetter = (
  grid: string[][],
  rows: number,
  cols: number,
  pos: number[],
  option: number[],
  count: number,
  letter: string
) => {
  const y = pos[0] + count * option[0];
  const x = pos[1] + count * option[1];
  if (y < 0 || y >= rows || x < 0 || x >= cols) {
    return false;
  }
  return grid[y][x] === letter;
};

const solve1 = (fileName: string) => {
  const grid = parse(fileName);
  const rows = grid.length;
  const cols = grid[0].length;
  const options = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  let total = 0;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      for (const option of options) {
        const pos = [y, x];
        if (
          checkLetter(grid, rows, cols, pos, option, 0, "X") &&
          checkLetter(grid, rows, cols, pos, option, 1, "M") &&
          checkLetter(grid, rows, cols, pos, option, 2, "A") &&
          checkLetter(grid, rows, cols, pos, option, 3, "S")
        ) {
          total++;
        }
      }
    }
  }
  return total;
};

const solve2 = (fileName: string) => {
  const grid = parse(fileName);
  const rows = grid.length;
  const cols = grid[0].length;
  const options = [
    {
      option: [-1, -1],
      startOffset: [-2, 0],
      direction: [1, -1],
    },
    {
      option: [-1, 1],
      startOffset: [-2, 0],
      direction: [1, 1],
    },
    {
      option: [1, -1],
      startOffset: [2, 0],
      direction: [-1, -1],
    },
    {
      option: [1, 1],
      startOffset: [2, 0],
      direction: [-1, 1],
    },
  ];

  let total = 0;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      for (const { option, startOffset, direction } of options) {
        const pos = [y, x];
        if (
          checkLetter(grid, rows, cols, pos, option, 0, "M") &&
          checkLetter(grid, rows, cols, pos, option, 1, "A") &&
          checkLetter(grid, rows, cols, pos, option, 2, "S")
        ) {
          console.log("pos", pos);
          const off_pos = [pos[0] + startOffset[0], pos[1] + startOffset[1]];
          if (
            (checkLetter(grid, rows, cols, off_pos, direction, 0, "M") &&
              checkLetter(grid, rows, cols, off_pos, direction, 1, "A") &&
              checkLetter(grid, rows, cols, off_pos, direction, 2, "S")) ||
            (checkLetter(grid, rows, cols, off_pos, direction, 0, "S") &&
              checkLetter(grid, rows, cols, off_pos, direction, 1, "A") &&
              checkLetter(grid, rows, cols, off_pos, direction, 2, "M"))
          ) {
            total++;
          }
        }
      }
    }
  }
  return total / 2;
};

const main = (runExampleInput: boolean) => {
  const folderPath = import.meta.url
    .replace("file://", "")
    .replace("/solve.ts", "");
  const filename = `${folderPath}/${
    runExampleInput ? "example_input" : "input"
  }`;
  console.log(`Solving ${runExampleInput ? "example" : "real"} input`);
  console.log(`Task 1: ${solve1(filename)}`);
  console.log(`Task 2: ${solve2(filename)}`);
};

// Run!
const RUN_EXAMPLE_INPUT = process.argv[2] === "example";
main(RUN_EXAMPLE_INPUT);
