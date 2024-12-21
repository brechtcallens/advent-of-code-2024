import fs from "fs";
import { MinPriorityQueue } from "@datastructures-js/priority-queue";

const numKeypad = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  [null, "0", "A"],
];

const dirKeypad = [
  [null, "^", "A"],
  ["<", "v", ">"],
];

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

  toString() {
    if (this.y === -1 && this.x === 0) {
      return "^";
    } else if (this.y === 0 && this.x === 1) {
      return ">";
    } else if (this.y === 1 && this.x === 0) {
      return "v";
    } else if (this.y === 0 && this.x === -1) {
      return "<";
    } else {
      throw new Error(`Can't stringify ${this}`);
    }
  }
}

const moveVectors = [
  new NumberPair(-1, 0),
  new NumberPair(0, 1),
  new NumberPair(1, 0),
  new NumberPair(0, -1),
];

type Path = {
  position: NumberPair;
  path: string;
  cost: number;
};

const findShortestPaths = (
  grid: string[][],
  from: NumberPair,
  to: NumberPair
) => {
  let minCost = Number.MAX_VALUE;
  const shortestPaths: string[] = [];

  const queue = new MinPriorityQueue<Path>((path) => path.cost);
  queue.enqueue({ position: from, path: "", cost: 0 });

  while (queue.size() > 0) {
    const { position, path, cost } = queue.dequeue();
    if (cost > minCost) {
      break;
    }

    if (position.equals(to)) {
      shortestPaths.push(path);
      minCost = cost;
      continue;
    }

    for (const moveVector of moveVectors) {
      const nextPosition = position.add(moveVector);
      if (
        0 <= nextPosition.y &&
        nextPosition.y < grid.length &&
        0 <= nextPosition.x &&
        nextPosition.x < grid[0].length &&
        grid[nextPosition.y][nextPosition.x] !== null
      ) {
        queue.push({
          position: nextPosition,
          path: `${path}${moveVector.toString()}`,
          cost: cost + 1,
        });
      }
    }
  }
  return shortestPaths;
};

const getShortestPathsMapping = (
  grid: string[][]
): Record<string, Record<string, string[]>> => {
  const mapping = {};
  for (let yFrom = 0; yFrom < grid.length; yFrom++) {
    for (let xFrom = 0; xFrom < grid[yFrom].length; xFrom++) {
      for (let yTo = 0; yTo < grid.length; yTo++) {
        for (let xTo = 0; xTo < grid[yTo].length; xTo++) {
          const fromValue = grid[yFrom][xFrom];
          const toValue = grid[yTo][xTo];
          if (fromValue !== null && toValue !== null) {
            const from = NumberPair.fromArray([yFrom, xFrom]);
            const to = NumberPair.fromArray([yTo, xTo]);

            mapping[fromValue] ||= {};
            mapping[fromValue][toValue] = from.equals(to)
              ? [""]
              : findShortestPaths(grid, from, to);
          }
        }
      }
    }
  }
  return mapping;
};

const parse = (fileName: string) => {
  const input = fs.readFileSync(fileName, "utf8");
  const lines = input.split("\n");
  return lines;
};

const getCombosHorizontally = (
  input: string,
  mapping: Record<string, Record<string, string[]>>,
  withA: boolean,
  subsolution: string = "",
  previous: string = "A"
) => {
  if (input.length === 0) {
    return [subsolution];
  }

  const [current, ...otherinput] = input;
  const subsolutions: string[] = [];
  const options = mapping[previous][current];
  for (const option of options) {
    const combos = getCombosHorizontally(
      otherinput.join(""),
      mapping,
      withA,
      subsolution + option + (withA ? "A" : ""),
      current
    );
    subsolutions.push(...combos);
  }
  return subsolutions;
};

const solve1 = (fileName: string) => {
  const lines = parse(fileName);
  const numKeypadMapping = getShortestPathsMapping(numKeypad);
  const dirKeypadMapping = getShortestPathsMapping(dirKeypad);

  let total = 0;
  for (const line of lines) {
    let lineMin = Number.MAX_VALUE;
    const combos1 = getCombosHorizontally(line, numKeypadMapping, true);
    for (const combo1 of combos1) {
      // console.log("1.", combo1);
      const combos2 = getCombosHorizontally(combo1, dirKeypadMapping, true);
      for (const combo2 of combos2) {
        // console.log("   2.", combo2);
        const combos3 = getCombosHorizontally(combo2, dirKeypadMapping, true);
        for (const combo3 of combos3) {
          // console.log("      3.", combo3);
          if (combo3.length < lineMin) {
            lineMin = combo3.length;
          }
        }
      }
    }
    console.log(parseInt(line.slice(0, line.length - 1)), lineMin);
    total += parseInt(line.slice(0, line.length - 1)) * lineMin;
  }

  return total;
};

const solve2 = (fileName: string) => {
  const lines = parse(fileName);
  // Solve!
  return `${lines[0]}, ${lines.length}`;
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
