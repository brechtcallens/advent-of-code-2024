import fs from "fs";

const parse = (fileName: string) => {
  const input = fs.readFileSync(fileName, "utf8");

  const lines = input.split("\n");
  //   const parsedLines = lines
  //     .map((line) => line.trim().split(/(\s+)/))
  //     .map((line) => [parseInt(line[0]), parseInt(line[2])]);

  return lines;
};

const solve1 = (fileName: string) => {
  const lines = parse(fileName);
  // Solve!
  return `${lines[0]}, ${lines.length}`;
};

const solve2 = (fileName: string) => {
  const lines = parse(fileName);
  // Solve!
  return `${lines[0]}, ${lines.length}`;
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
