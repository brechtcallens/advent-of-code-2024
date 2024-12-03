import fs from "fs";

const parse = (fileName: string) => {
  const input = fs.readFileSync(fileName, "utf8");
  return input;
};

const solve1 = (fileName: string) => {
  const input = parse(fileName);
  const matches = [...input.matchAll(/mul\(([0-9]{1,3}),([0-9]{1,3})\)/gm)];
  return matches.reduce(
    (total, match) => total + parseInt(match[1]) * parseInt(match[2]),
    0
  );
};

const solve2 = (fileName: string) => {
  const input = parse(fileName);
  const matches = [
    ...input.matchAll(/do\(\)|don't\(\)|mul\(([0-9]{1,3}),([0-9]{1,3})\)/gm),
  ];
  let sum = 0;
  let enabled = true;
  for (const match of matches) {
    if (match[0] === "don't()") {
      enabled = false;
    } else if (match[0] === "do()") {
      enabled = true;
    } else if (enabled) {
      sum += parseInt(match[1]) * parseInt(match[2]);
    }
  }
  return sum;
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