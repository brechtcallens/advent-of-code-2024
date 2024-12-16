import fs, { Dir } from "fs";

const parse = (fileName: string) => {
  const input = fs.readFileSync(fileName, "utf8");
  const grid = input.split("\n").map((line) => line.trim().split(""));

  let start: NumberPair = [0, 0];
  let end: NumberPair = [0, 0];
  for (const [y, line] of grid.entries()) {
    for (const [x, char] of line.entries()) {
      if (char === "S") {
        start = [y, x];
      } else if (char === "E") {
        end = [y, x];
      }
    }
  }

  return { grid, start, end };
};

type NumberPair = [number, number];
type Direction = "^" | ">" | "v" | "<";
const directions: Direction[] = ["^", ">", "v", "<"];

const moveToVector: Record<Direction, NumberPair> = {
  "^": [-1, 0],
  ">": [0, 1],
  v: [1, 0],
  "<": [0, -1],
};

const moveOnce = (
  grid: string[][],
  position: NumberPair,
  direction: Direction
): NumberPair => {
  const vector = moveToVector[direction];
  const nextPosition: NumberPair = [
    position[0] + vector[0],
    position[1] + vector[1],
  ];
  if (grid[nextPosition[0]][nextPosition[1]] !== "#") {
    return nextPosition;
  } else {
    return position;
  }
};

type Node = {
  position: NumberPair;
  direction: Direction;
  cost: number;
  history: string[];
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

const nodeToKeyWithDirection = (node: Node) =>
  `${node.position[0]},${node.position[1]},${node.direction}`;

const nodeToKeyWithoutDirection = (node: Node) =>
  `${node.position[0]},${node.position[1]}`;

const solve1 = (fileName: string) => {
  const { grid, start, end } = parse(fileName);

  const visited = new Set<string>();
  const queue = new PriorityQueue<Node>();
  queue.enqueue({
    position: [...start],
    direction: ">",
    cost: 0,
    history: [],
  });

  while (queue.size() > 0) {
    const { position, direction, cost, history } = queue.dequeue();

    const cacheKey = nodeToKeyWithDirection({
      position,
      direction,
      cost,
      history,
    });
    if (visited.has(cacheKey)) {
      continue;
    }
    visited.add(cacheKey);

    if (position[0] === end[0] && position[1] === end[1]) {
      return cost;
    }

    for (const nextDirection of directions) {
      const nextPosition = moveOnce(grid, position, nextDirection);

      const partialNextNode = {
        position: direction === nextDirection ? nextPosition : position,
        direction: nextDirection as Direction,
        cost: direction === nextDirection ? cost + 1 : cost + 1000,
        history,
      };
      queue.enqueue({
        ...partialNextNode,
        history: [...history, nodeToKeyWithDirection(partialNextNode)],
      });
    }
  }

  return -1;
};

const solve2 = (fileName: string) => {
  const max = solve1(fileName);
  const { grid, start, end } = parse(fileName);

  const queue = new PriorityQueue<Node>();
  queue.enqueue({
    position: [...start],
    direction: ">",
    cost: 0,
    history: [],
  });

  let maxCost: Record<string, number> = {};
  const allTiles = new Set<string>();

  // For some stupid reason example input has start and end, but real input not...
  allTiles.add(`${start[0]},${start[1]}`);
  allTiles.add(`${end[0]},${end[1]}`);

  while (queue.size() > 0) {
    const { position, direction, cost, history } = queue.dequeue();

    if (position[0] === end[0] && position[1] === end[1] && cost <= max) {
      history.forEach((key) => allTiles.add(key));
      continue;
    }

    const cacheKey = nodeToKeyWithDirection({
      position,
      direction,
      cost,
      history,
    });
    if (cacheKey in maxCost && cost > maxCost[cacheKey]) {
      continue;
    }
    maxCost[cacheKey] = cost;

    for (const nextDirection of directions) {
      const nextPosition = moveOnce(grid, position, nextDirection);
      const partialNextNode = {
        position: direction === nextDirection ? nextPosition : position,
        direction: nextDirection as Direction,
        cost: direction === nextDirection ? cost + 1 : cost + 1000,
        history,
      };
      queue.enqueue({
        ...partialNextNode,
        history: [...history, nodeToKeyWithoutDirection(partialNextNode)],
      });
    }
  }

  return [...allTiles].length;
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
