import fs from "fs";

const parse = (fileName: string) => {
  const input = fs.readFileSync(fileName, "utf8");

  const grid = input.split("\n").map((line) => line.trim().split(""));
  let start = [0, 0];
  let end = [0, 0];
  for (const [y, line] of grid.entries()) {
    for (const [x, char] of line.entries()) {
      if (char === "S") {
        start = [y, x];
      } else if (char === "E") {
        end = [y, x];
      }
    }
  }

  return {
    grid: new GridSolver(grid),
    start: NumberPair.fromArray(start),
    end: NumberPair.fromArray(end),
  };
};

class GridSolver {
  private costGrid: number[][];

  constructor(public readonly grid: string[][]) {}

  walk(start: NumberPair, end: NumberPair) {
    // Reset cost grid for a new walk.
    this.costGrid = this.grid.map((line) => line.map((_) => -1));

    // Prepare for filling in grid costs and walked path.
    let position = end;
    let cost = 0;
    const path: NumberPair[] = [position];
    this.setCost(position, cost);

    while (!position.equals(start)) {
      this.setCost(position, cost);
      for (const vector of moveVectors) {
        const nextPosition = position.add(vector);
        if (
          this.contains(nextPosition) && // don't go out of bounds
          !this.isWall(nextPosition) && // don't go through walls
          this.getCost(nextPosition) === -1 // don't go backwards
        ) {
          position = nextPosition;
          cost++;

          path.push(position);
          this.setCost(position, cost);

          break;
        }
      }
    }

    path.reverse();
    return path;
  }

  rows() {
    return this.grid.length;
  }

  cols() {
    return this.grid[0].length;
  }

  contains(position: NumberPair) {
    return (
      position.y >= 1 &&
      position.y < this.rows() - 1 &&
      position.x >= 1 &&
      position.x < this.cols() - 1
    );
  }

  isWall(position: NumberPair) {
    return this.grid[position.y][position.x] === "#";
  }

  getCost(position: NumberPair) {
    return this.costGrid[position.y][position.x];
  }

  setCost(position: NumberPair, cost: number) {
    this.costGrid[position.y][position.x] = cost;
  }
}

class NumberPair {
  static fromArray(array: number[]) {
    if (array.length !== 2) {
      throw new Error("NumberPair: Array length must be 2");
    }
    return new NumberPair(array[0], array[1]);
  }

  constructor(public readonly y: number, public readonly x: number) {}

  add(other: NumberPair) {
    return new NumberPair(this.y + other.y, this.x + other.x);
  }

  equals(other: NumberPair) {
    return this.y === other.y && this.x === other.x;
  }

  cost() {
    return Math.abs(this.y) + Math.abs(this.x);
  }
}

const moveVectors = [
  new NumberPair(-1, 0),
  new NumberPair(0, 1),
  new NumberPair(1, 0),
  new NumberPair(0, -1),
];

const getTeleportVectors = (range: number) => {
  const positions: NumberPair[] = [];
  for (let y = -range; y <= range; y++) {
    for (let x = -range; x <= range; x++) {
      if (Math.abs(y) + Math.abs(x) <= range && !(y === 0 && x === 0)) {
        positions.push(new NumberPair(y, x));
      }
    }
  }
  return positions;
};

const solve = (
  grid: GridSolver,
  start: NumberPair,
  end: NumberPair,
  range: number,
  minSavedCost: number
) => {
  const path = grid.walk(start, end);
  const teleportVectors = getTeleportVectors(range);

  let counter = 0;
  for (const position of path) {
    const positionCost = grid.getCost(position);
    for (const teleportVector of teleportVectors) {
      const teleportPosition = position.add(teleportVector);
      const teleportCost = teleportVector.cost();
      if (
        grid.contains(teleportPosition) &&
        !grid.isWall(teleportPosition) &&
        grid.getCost(teleportPosition) + teleportCost + minSavedCost <=
          positionCost
      ) {
        counter++;
      }
    }
  }
  return counter;
};

const solve1 = (fileName: string, example: boolean) => {
  const { grid, start, end } = parse(fileName);
  const minSavedCost = example ? 1 : 100;
  return solve(grid, start, end, 2, minSavedCost);
};

const solve2 = (fileName: string, example: boolean) => {
  const { grid, start, end } = parse(fileName);
  const minSavedCost = example ? 50 : 100;
  return solve(grid, start, end, 20, minSavedCost);
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
    const task1 = func(filename, runExampleInput);
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
