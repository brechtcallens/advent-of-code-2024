import fs from "fs";

const parse = (fileName: string) => {
  const input = fs.readFileSync(fileName, "utf8");

  const lines = input.split("\n");
  const grid = lines.map((line) =>
    line
      .trim()
      .split(" ")
      .map((level) => parseInt(level))
  );
  return grid;
};

const checkLine = (line: number[]) => {
  const incr = line[0] < line[1];
  let prevValue;
  for (let value of line) {
    if (prevValue) {
      const diff = value - prevValue;
      if (
        (incr && (diff < 1 || diff > 3)) ||
        (!incr && (diff > -1 || diff < -3))
      ) {
        return false;
      }
    }
    prevValue = value;
  }
  return true;
};

const solve1 = (fileName: string) => {
  const lines = parse(fileName);

  const safeness = lines.map(checkLine);

  return safeness.reduce((acc, v) => acc + (v ? 1 : 0), 0);
};

const solve2 = (fileName: string) => {
  const lines = parse(fileName);

  const safeness = lines.map((line) => {
    const options = line.map((_, index) => [
      ...line.slice(0, index),
      ...line.slice(index + 1, line.length),
    ]);
    return options.some(checkLine);
  });

  return safeness.reduce((acc, v) => acc + (v ? 1 : 0), 0);
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
