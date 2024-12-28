import fs from "fs";

const parse = (fileName: string) => {
  const input = fs.readFileSync(fileName, "utf8");

  const [_values, _gates] = input.split("\n\n");

  const valuesSplitted = _values
    .split("\n")
    .map((line) => line.trim().split(": "));

  const values: Record<string, number> = valuesSplitted.reduce(
    (acc, splitLine) => {
      acc[splitLine[0]] = parseInt(splitLine[1]);
      return acc;
    },
    {}
  );

  const xString = valuesSplitted
    .filter((value) => value[0].startsWith("x"))
    .map((value) => value[1])
    .reverse()
    .join("");

  const yString = valuesSplitted
    .filter((value) => value[0].startsWith("y"))
    .map((value) => value[1])
    .reverse()
    .join("");

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

  return { values, gates, targets, xString, yString };
};

const operators: Record<string, (a: number, b: number) => number> = {
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

const equationOperators: Record<string, (a: string, b: string) => string> = {
  XOR: (a, b) => (a < b ? `(${a} XOR ${b})` : `(${b} XOR ${a})`),
  OR: (a, b) => (a < b ? `(${a} OR ${b})` : `(${b} OR ${a})`),
  AND: (a, b) => (a < b ? `(${a} AND ${b})` : `(${b} AND ${a})`),
};

const constructEquation = (
  target: string,
  values: Record<string, number>,
  gates: Record<string, string[]>
) => {
  if (target in values) {
    return target;
  }

  const [a, op, b] = gates[target];
  const equation = equationOperators[op](
    constructEquation(a, values, gates),
    constructEquation(b, values, gates)
  );

  return equation;
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
  const { values, gates, targets, xString, yString } = parse(fileName);

  const resultString = targets
    .reverse()
    .map((target) => solveRecursive(target, values, gates))
    .join("");
  const result = parseInt(resultString, 2);

  console.log(xString.padStart(46, " "), parseInt(xString, 2));
  console.log(yString.padStart(46, " "), parseInt(yString, 2));
  console.log(resultString.padStart(46, " "), parseInt(resultString, 2));
  console.log(parseInt(xString, 2) + parseInt(yString, 2));

  for (const target of targets) {
    const targetResult = constructEquation(target, values, gates);
    // console.log(target, targetResult.length, targetResult);
  }

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
