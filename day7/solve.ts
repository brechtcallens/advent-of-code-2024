import fs from "fs";

const parse = (fileName: string) => {
  const input = fs.readFileSync(fileName, "utf8");

  const lines = input.split("\n");
  const totalWithNumbers = lines.map((line) => {
    const splitted = line.trim().split(": ");
    const total = Number(splitted[0]);
    const numbers = splitted[1].split(" ").map(Number);
    return [total, numbers] as const;
  });

  return totalWithNumbers;
};

const operations1 = [
  (total: number, n: number) => total + n,
  (total: number, n: number) => total * n,
];

const operations2 = [
  ...operations1,
  (total: number, n: number) => Number(`${total}${n}`),
];

const solveRecursive = (
  total: number,
  subtotal: number,
  numbers: number[],
  operations: ((total: number, n: number) => number)[]
) => {
  // Return equality once numbers have been exhausted
  if (numbers.length === 0) {
    return subtotal === total;
  }

  // Return early once we go over.
  if (subtotal > total) {
    return false;
  }

  const [firstNumber, ...otherNumbers] = numbers;

  // If no subtotal yet, the first element needs to be chosen.
  if (subtotal === 0) {
    return solveRecursive(total, firstNumber, otherNumbers, operations);
  }

  // Otherwise go over operations DF recursively until all options or exhausted or a solution is found.
  for (const operation of operations) {
    const newSubTotal = operation(subtotal, firstNumber);
    if (solveRecursive(total, newSubTotal, otherNumbers, operations)) {
      return true;
    }
  }

  // Nothing returned true, so no solution exists from this point onwards.
  return false;
};

const solveIteratively = (
  total: number,
  numbers: number[],
  operations: ((total: number, n: number) => number)[]
) => {
  const [firstNumber, ...firstOtherNumbers] = numbers;
  const stack: [number, number[]][] = [[firstNumber, firstOtherNumbers]];
  while (stack.length > 0) {
    const [currentNumber, currentOtherNumbers] = stack.pop()!;
    if (currentOtherNumbers.length > 0) {
      const [nextNumber, ...nextOtherNumbers] = currentOtherNumbers;
      for (const operation of operations) {
        const newSubTotal = operation(currentNumber, nextNumber);
        if (newSubTotal <= total) {
          stack.push([newSubTotal, nextOtherNumbers]);
        }
      }
    } else {
      if (currentNumber === total) {
        return true;
      }
    }
  }
  return false;
};

const solve1 = (fileName: string) => {
  const input = parse(fileName);
  const amount = input.reduce((currentAmount, totalWithNumbers) => {
    const [total, numbers] = totalWithNumbers;
    if (solveRecursive(total, 0, numbers, operations1)) {
      return currentAmount + total;
    }
    return currentAmount;
  }, 0);
  return amount;
};

const solve2 = (fileName: string) => {
  const input = parse(fileName);
  const amount = input.reduce((currentAmount, totalWithNumbers) => {
    const [total, numbers] = totalWithNumbers;
    if (solveRecursive(total, 0, numbers, operations2)) {
      return currentAmount + total;
    }
    return currentAmount;
  }, 0);
  return amount;
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
