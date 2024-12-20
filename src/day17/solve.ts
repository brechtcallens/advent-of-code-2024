import fs from "fs";
import { exit } from "process";

const parse = (fileName: string) => {
  const input = fs.readFileSync(fileName, "utf8");
  const [A, B, C, ...program] = [...input.match(/(\d+)/g)].map(Number);
  return { A, B, C, program };
};

const bits = (b) => (b >>> 0).toString(2).padStart(32, "0");

const solve1 = (fileName: string) => {
  let { A, B, C, program } = parse(fileName);

  let pointer = 0;
  const output: number[] = [];
  while (0 <= pointer && pointer < program.length - 1) {
    console.log(`A: ${bits(A)}, B: ${bits(B)}, C: ${bits(C)}`);
    const operandValues = [0, 1, 2, 3, A, B, C, -1];
    const literalOperand = program[pointer + 1];
    const comboOperand = operandValues[literalOperand];

    let jump = true;
    const instruction = program[pointer];
    switch (instruction) {
      case 0:
        A = Math.trunc(A / Math.pow(2, comboOperand));
        break;
      case 1:
        B = B ^ literalOperand;
        break;
      case 2:
        B = comboOperand % 8;
        break;
      case 3:
        if (A !== 0) {
          pointer = literalOperand;
          jump = false;
        }
        break;
      case 4:
        B = B ^ C;
        break;
      case 5:
        console.log(comboOperand % 8);
        output.push(comboOperand % 8);
        break;
      case 6:
        B = Math.trunc(A / Math.pow(2, comboOperand));
        break;
      case 7:
        C = Math.trunc(A / Math.pow(2, comboOperand));
        break;
    }

    if (jump) {
      pointer += 2;
    }
  }
  return output.join(",");
};

const solve2 = (fileName: string) => {
  let { B: initB, C: initC, program } = parse(fileName);

  let it = 0;
  let A: number, B: number, C: number;
  while (true) {
    // Reset
    A = it;
    B = initB;
    C = initC;

    // Run
    let pointer = 0;
    let programIndexToCheck = 0;
    let isValid = true;
    while (0 <= pointer && pointer < program.length - 1 && isValid) {
      const operandValues = [0, 1, 2, 3, A, B, C, -1];
      const literalOperand = program[pointer + 1];
      const comboOperand = operandValues[literalOperand];

      let jump = true;
      const instruction = program[pointer];
      switch (instruction) {
        case 0:
          A = Math.trunc(A / Math.pow(2, comboOperand));
          break;
        case 1:
          B = B ^ literalOperand;
          break;
        case 2:
          B = comboOperand % 8;
          break;
        case 3:
          if (A !== 0) {
            pointer = literalOperand;
            jump = false;
          }
          break;
        case 4:
          B = B ^ C;
          break;
        case 5:
          const outputDigit = comboOperand % 8;
          if (outputDigit !== program[programIndexToCheck]) {
            isValid = false;
          }
          programIndexToCheck++;
          if (programIndexToCheck === program.length) {
            return it;
          }
          break;
        case 6:
          B = Math.trunc(A / Math.pow(2, comboOperand));
          break;
        case 7:
          C = Math.trunc(A / Math.pow(2, comboOperand));
          break;
      }

      if (jump) {
        pointer += 2;
      }
    }

    // Check next A
    it++;
  }
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