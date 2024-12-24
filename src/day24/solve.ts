import fs from "fs";

const parse = (fileName: string) => {
  const input = fs.readFileSync(fileName, "utf8");

  const [_values, _gates] = input.split("\n\n");
  const values: Record<string, number> = _values
    .split("\n")
    .map((line) => line.trim().split(": "))
    .reduce((acc, splitLine) => {
      acc[splitLine[0]] = parseInt(splitLine[1]);
      return acc;
    }, {});

  const gates: Record<string, string[]> = _gates
    .split("\n")
    .map((line) => line.replace("-> ", "").trim().split(" "))
    .reduce((acc, splitLine) => {
      const target = splitLine.pop();
      acc[target] = splitLine;
      return acc;
    }, {});

  const targets = Object.keys(gates)
    .filter((target) => target.startsWith("z"))
    .sort();

  return { values, gates, targets };
};

const operators = {
  XOR: (a: number, b: number) => a ^ b,
  OR: (a: number, b: number) => a | b,
  AND: (a: number, b: number) => a & b,
};

const solveRecursive = (
  target: string,
  values: Record<string, number>,
  gates: Record<string, string[]>
) => {
  if (target in values) {
    return values[target];
  }

  const [a, op, b] = gates[target];
  const targetResult = operators[op](
    solveRecursive(a, values, gates),
    solveRecursive(b, values, gates)
  );
  values[target] = targetResult;

  return targetResult;
};

const solve1 = (fileName: string) => {
  const { values, gates, targets } = parse(fileName);
  const resultString = targets
    .reverse()
    .map((target) => solveRecursive(target, values, gates))
    .join("");
  const result = parseInt(resultString, 2);
  return result;
};

const solve2 = (fileName: string) => {
  const { values, gates } = parse(fileName);
  // Solve!
  console.log(Object.keys(gates).length);
  return -1;
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
