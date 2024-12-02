import fs from "fs";

const parse = (fileName: string) => {
  const input = fs.readFileSync(fileName, "utf8");

  const lines = input.split("\n");
  const numberLines = lines
    .map((line) => line.trim().split(/(\s+)/))
    .map((line) => [parseInt(line[0]), parseInt(line[2])]);

  const [l1, l2] = numberLines.reduce<number[][]>(
    (acc, line) => {
      acc[0].push(line[0]);
      acc[1].push(line[1]);
      return acc;
    },
    [[], []]
  );

  l1.sort();
  l2.sort();

  return [l1, l2];
};

const solve1 = (fileName: string) => {
  const [l1, l2] = parse(fileName);
  const sum = l1.reduce((acc, v, i) => acc + Math.abs(v - l2[i]), 0);
  return sum;
};

const solve2 = (fileName: string) => {
  const [l1, l2] = parse(fileName);

  const l2Counters = l2.reduce<Record<number, number>>((acc, v, i) => {
    acc[v] = (acc[v] || 0) + 1;
    return acc;
  }, {});

  const sum = l1.reduce((acc, v, i) => acc + v * (l2Counters[v] || 0), 0);
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
