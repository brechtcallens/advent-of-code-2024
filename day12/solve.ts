import fs from "fs";

const parse = (fileName: string) => {
  const input = fs.readFileSync(fileName, "utf8");

  const lines = input.split("\n");
  const grid = lines.map((line) => line.trim().split(""));

  return grid;
};

type Coordinate = [number, number];
const vectors: Coordinate[] = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const applyVector = (
  coordinate: Coordinate,
  vector: Coordinate
): Coordinate => [coordinate[0] + vector[0], coordinate[1] + vector[1]];

const isInGrid = (grid: string[][], [y, x]: Coordinate) =>
  y >= 0 && y < grid.length && x >= 0 && x < grid.length;

const findNeighbours = (
  grid: string[][],
  coordinate: Coordinate,
  visited: Set<string>,
  area: Set<string>
) => {
  const character = grid[coordinate[0]][coordinate[1]];
  const nextPositions: Coordinate[] = vectors
    .map((vector): Coordinate => applyVector(coordinate, vector))
    .filter(
      ([nextY, nextX]) =>
        isInGrid(grid, [nextY, nextX]) &&
        grid[nextY][nextX] === character &&
        !visited.has(`${nextY},${nextX}`)
    ) as Coordinate[];
  for (const nextPosition of nextPositions) {
    const nextPositionKey = `${nextPosition[0]},${nextPosition[1]}`;
    visited.add(nextPositionKey);
    area.add(nextPositionKey);
    findNeighbours(grid, nextPosition, visited, area);
  }
};

const solve1 = (fileName: string) => {
  const grid = parse(fileName);
  const size = grid.length;

  const visited = new Set<string>();
  const areas: Coordinate[][] = [];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (!visited.has(`${i},${j}`)) {
        const newArea = new Set<string>([`${i},${j}`]);
        visited.add(`${i},${j}`);
        findNeighbours(grid, [i, j], visited, newArea);
        areas.push(
          [...newArea].map(
            (coordinateString) =>
              coordinateString.split(",").map(Number) as Coordinate
          )
        );
      }
    }
  }

  let total = 0;
  for (const area of areas) {
    let fences = 0;
    const character = grid[area[0][0]][area[0][1]];
    for (const coordinate of area) {
      const fencesAround = vectors
        .map((vector): Coordinate => applyVector(coordinate, vector))
        .filter(
          (nextPosition) =>
            !isInGrid(grid, nextPosition) ||
            grid[nextPosition[0]][nextPosition[1]] !== character
        ).length;
      fences += fencesAround;
    }

    total += fences * area.length;
  }

  return total;
};

const solve2 = (fileName: string) => {
  const grid = parse(fileName);
  const size = grid.length;

  const visited = new Set<string>();
  const areas: Coordinate[][] = [];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (!visited.has(`${i},${j}`)) {
        const newArea = new Set<string>([`${i},${j}`]);
        visited.add(`${i},${j}`);
        findNeighbours(grid, [i, j], visited, newArea);
        areas.push(
          [...newArea].map(
            (coordinateString) =>
              coordinateString.split(",").map(Number) as Coordinate
          )
        );
      }
    }
  }

  let total = 0;
  for (const area of areas) {
    const character = grid[area[0][0]][area[0][1]];

    const configs: {
      name: string;
      watchVector: Coordinate;
      compareVector: Coordinate;
      sort: number;
    }[] = [
      {
        name: "top",
        watchVector: [-1, 0],
        compareVector: [-1, -1],
        sort: -1,
      },
      {
        name: "left",
        watchVector: [0, -1],
        compareVector: [-1, -1],
        sort: -1,
      },
      {
        name: "bottom",
        watchVector: [1, 0],
        compareVector: [1, 1],
        sort: 1,
      },
      {
        name: "right",
        watchVector: [0, 1],
        compareVector: [1, 1],
        sort: 1,
      },
    ];

    // console.log(area);

    const sides = configs.map((config) => {
      // Sort asc or desc depending on config
      area.sort((n1, n2) => {
        if (n1[0] < n2[0] || (n1[0] === n2[0] && n1[1] < n2[1])) {
          return config.sort;
        } else if (n2[0] < n1[0] || (n1[0] === n2[0] && n2[1] < n1[1])) {
          return -1 * config.sort;
        } else {
          return 0;
        }
      });

      let sides = 0;
      const watched = new Set<string>();
      for (const coordinate of area) {
        const watchCoordinate = applyVector(coordinate, config.watchVector);
        const compareVector = applyVector(coordinate, config.compareVector);
        if (
          !isInGrid(grid, watchCoordinate) ||
          grid[watchCoordinate[0]][watchCoordinate[1]] !== character
        ) {
          // Top is different, so we need to check if we're still on a line
          if (!watched.has(`${compareVector[0]},${compareVector[1]}`)) {
            sides++;
          }
          watched.add(`${watchCoordinate[0]},${watchCoordinate[1]}`);
        }
      }

      // console.log(`${character} - ${config.name}: ${sides}`);
      return sides;
    });

    const sidesTotal = sides.reduce((acc, val) => acc + val, 0);

    total += sidesTotal * area.length;
  }

  return total;
};

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
