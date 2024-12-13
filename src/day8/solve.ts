import fs from "fs";

type Coordinate = [number, number];

const parse = (fileName: string) => {
  const input = fs.readFileSync(fileName, "utf8");

  const grid = input.split("\n").map((line) => line.trim().split(""));

  return grid;
};

type FindAntidoteFunction = typeof findAntidote;

const findAntidote = (
  from: Coordinate,
  to: Coordinate,
  rows: number,
  cols: number
): Coordinate[] =>
  [[to[0] - from[0] + to[0], to[1] - from[1] + to[1]] as Coordinate].filter(
    (antidote) =>
      antidote[0] >= 0 &&
      antidote[0] < rows &&
      antidote[1] >= 0 &&
      antidote[1] < cols
  );

const findAllAntidotes = (
  from: Coordinate,
  to: Coordinate,
  rows: number,
  cols: number
): Coordinate[] => {
  const allAntidotes: Coordinate[] = [];
  const rowDiff = to[0] - from[0];
  const colDiff = to[1] - from[1];
  let antidote = [to[0], to[1]];
  while (
    antidote[0] >= 0 &&
    antidote[0] < rows &&
    antidote[1] >= 0 &&
    antidote[1] < cols
  ) {
    allAntidotes.push([antidote[0], antidote[1]]);
    antidote = [antidote[0] + rowDiff, antidote[1] + colDiff];
  }
  return allAntidotes;
};

const getFrequencies = (grid: string[][]) =>
  grid.reduce<Record<string, Coordinate[]>>((acc, line, row) => {
    for (let col = 0; col < line.length; col++) {
      if (/^[A-Za-z0-9]$/.test(line[col])) {
        acc[line[col]] = [...(acc[line[col]] || []), [row, col]];
      }
    }
    return acc;
  }, {});

const solve = (
  fileName: string,
  findAntidoteFunction: FindAntidoteFunction
) => {
  const grid = parse(fileName);
  const rows = grid.length;
  const cols = grid[0].length;

  const frequencies = getFrequencies(grid);

  const antidotes = new Set<string>();
  for (const coordinates of Object.values(frequencies)) {
    for (let i = 0; i < coordinates.length; i++) {
      for (let j = i + 1; j < coordinates.length; j++) {
        const currentAntidotes = [
          ...findAntidoteFunction(coordinates[i], coordinates[j], rows, cols),
          ...findAntidoteFunction(coordinates[j], coordinates[i], rows, cols),
        ];

        currentAntidotes.forEach((antidote) =>
          antidotes.add(`${antidote[0]},${antidote[1]}`)
        );
      }
    }
  }

  return [...antidotes].length;
};

const solve1 = (fileName: string) => solve(fileName, findAntidote);

const solve2 = (fileName: string) => solve(fileName, findAllAntidotes);

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
