import fs from "fs";

const parse = (fileName: string, size: number, drops: number) => {
  const input = fs.readFileSync(fileName, "utf8");

  const grid = [...Array(size)].map(() => [...Array<string>(size)].fill("."));
  const lines = input.split("\n");
  for (let i = 0; i < drops; i++) {
    const [x, y] = lines[i].trim().split(",").map(Number);
    grid[y][x] = "#";
  }

  return grid;
};

class PriorityQueue<T extends { cost: number }> {
  #values: T[];

  constructor() {
    this.#values = [];
  }

  enqueue(node: T) {
    for (let i = 0; i < this.#values.length; i++) {
      if (this.#values[i].cost > node.cost) {
        this.#values.splice(i, 0, node);
        return;
      }
    }
    this.#values.push(node);
  }

  dequeue() {
    return this.#values.shift();
  }

  size() {
    return this.#values.length;
  }
}

type NumberPair = [number, number];
const directions: NumberPair[] = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const solve1 = (fileName: string, example: boolean) => {
  const size = example ? 7 : 71;
  const drops = example ? 12 : 1024;

  const grid = parse(fileName, size, drops);
  const costs = [...Array(size)].map(() =>
    [...Array<number>(size)].fill(Number.MAX_SAFE_INTEGER)
  );

  const queue = new PriorityQueue<{ position: NumberPair; cost: number }>();
  queue.enqueue({ position: [0, 0], cost: 0 });
  while (queue.size() > 0) {
    const { position, cost } = queue.dequeue();

    if (position[0] === size - 1 && position[1] === size - 1) {
      return cost;
    }

    if (costs[position[0]][position[1]] <= cost) {
      continue;
    }
    costs[position[0]][position[1]] = cost;

    for (const [dy, dx] of directions) {
      const [nextY, nextX] = [position[0] + dy, position[1] + dx];
      if (
        nextX < 0 ||
        nextX >= size ||
        nextY < 0 ||
        nextY >= size ||
        grid[nextY][nextX] === "#"
      ) {
        continue;
      }
      queue.enqueue({ position: [nextY, nextX], cost: cost + 1 });
    }
  }

  return -1;
};

const solve = (fileName: string, example: boolean, drops: number) => {
  const size = example ? 7 : 71;

  const grid = parse(fileName, size, drops);
  const costs = [...Array(size)].map(() =>
    [...Array<number>(size)].fill(Number.MAX_SAFE_INTEGER)
  );

  const queue = new PriorityQueue<{ position: NumberPair; cost: number }>();
  queue.enqueue({ position: [0, 0], cost: 0 });
  while (queue.size() > 0) {
    const { position, cost } = queue.dequeue();

    if (position[0] === size - 1 && position[1] === size - 1) {
      return cost;
    }

    if (costs[position[0]][position[1]] <= cost) {
      continue;
    }
    costs[position[0]][position[1]] = cost;

    for (const [dy, dx] of directions) {
      const [nextY, nextX] = [position[0] + dy, position[1] + dx];
      if (
        nextX < 0 ||
        nextX >= size ||
        nextY < 0 ||
        nextY >= size ||
        grid[nextY][nextX] === "#"
      ) {
        continue;
      }
      queue.enqueue({ position: [nextY, nextX], cost: cost + 1 });
    }
  }

  return -1;
};

const solve2 = (fileName: string, example: boolean) => {
  const size = example ? 7 : 71;

  let drops = 1;
  while (solve(fileName, example, drops) !== -1) {
    drops++;
  }
  return fs.readFileSync(fileName, "utf8").split("\n")[drops - 1];
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
