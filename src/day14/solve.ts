import { time } from "console";
import fs from "fs";

type Robot = { x: number; y: number; vX: number; vY: number };

type GridInfo = { rows: number; cols: number };

const parse = (fileName: string): Robot[] => {
  const input = fs.readFileSync(fileName, "utf8");

  const robots = input.split("\n").map((robot) => {
    const [x, y, vX, vY] = robot.match(/([\-0-9]+)/gm)?.map(Number) as number[];
    return { x, y, vX, vY };
  });

  return robots;
};

const move = (robot: Robot, gridInfo: GridInfo) => {
  robot.x = (robot.x + robot.vX + gridInfo.cols) % gridInfo.cols;
  robot.y = (robot.y + robot.vY + gridInfo.rows) % gridInfo.rows;
};

const solve1 = (fileName: string, example: boolean) => {
  const robots = parse(fileName);
  const gridInfo: GridInfo = example
    ? { rows: 7, cols: 11 }
    : { rows: 103, cols: 101 };

  for (let it = 0; it < 100; it++) {
    for (const robot of robots) {
      move(robot, gridInfo);
    }
  }

  const middleX = (gridInfo.cols - 1) / 2;
  const middleY = (gridInfo.rows - 1) / 2;
  const quadrants = robots.reduce(
    (acc, robot) => {
      if (robot.x < middleX) {
        if (robot.y < middleY) {
          acc[0]++;
        } else if (robot.y > middleY) {
          acc[2]++;
        }
      } else if (robot.x > middleX) {
        if (robot.y < middleY) {
          acc[1]++;
        } else if (robot.y > middleY) {
          acc[3]++;
        }
      }
      return acc;
    },
    [0, 0, 0, 0]
  );

  return quadrants.reduce((acc, val) => acc * val, 1);
};

const isTreeFormation = (robots: Robot[], gridInfo: GridInfo, it: number) => {
  const grid = Array(gridInfo.rows)
    .fill(".")
    .map(() => Array(gridInfo.cols).fill("."));
  robots.forEach((robot) => (grid[robot.y][robot.x] = "X"));

  // Big ass assumption that a Christmas tree in ASCII art would consist of some neighbouring X's.
  if (grid.some((line) => line.join("").includes("XXXXXXXX"))) {
    console.log(`Iteration: ${it}`);
    grid.forEach((line) => {
      console.log(line.join(""));
    });
    return it;
  }

  return -1;
};

const solve2 = (fileName: string, example: boolean) => {
  const robots = parse(fileName);
  const gridInfo: GridInfo = example
    ? { rows: 7, cols: 11 }
    : { rows: 103, cols: 101 };

  let it = 0;
  let foundIt = -1;
  while (foundIt === -1) {
    it++;
    for (const robot of robots) {
      move(robot, gridInfo);
    }
    foundIt = isTreeFormation(robots, gridInfo, it);
  }
  return foundIt;
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
