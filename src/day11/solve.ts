import fs from "fs";

const parse = (fileName: string) => {
  const input = fs.readFileSync(fileName, "utf8");
  const lines = input.split(" ").map(Number);
  return lines;
};

const solve = (input: number[], iterations: number) => {
  let line = input;
  for (let it = 0; it < iterations; it++) {
    line = line.flatMap((n) => {
      if (n === 0) {
        return [1];
      } else {
        const nString = n.toString();
        if (nString.length % 2 === 0) {
          const halfLength = nString.length / 2;
          return [
            Number(nString.slice(0, halfLength)),
            Number(nString.slice(halfLength, nString.length)),
          ];
        } else {
          return [n * 2024];
        }
      }
    });
  }
  return line.length;
};

const solveAndCache = (
  n: number,
  iteration: number,
  cached: Record<string, number>
) => {
  const it = iteration - 1;
  const result = solveRecursively(n, it, cached);
  cached[`${n},${it}`] = result;
  return result;
};

const solveRecursively = (
  n: number,
  iteration: number,
  cached: Record<string, number>
): number => {
  // Return once we've done the right amount of iterations.
  if (iteration === 0) {
    return 1;
  }

  // If we already calculated the answer, return from cache.
  const cachedKey = `${n},${iteration}`;
  if (cachedKey in cached) {
    return cached[cachedKey];
  }

  if (n === 0) {
    // Case 1: 0 -> 1
    return solveAndCache(1, iteration, cached);
  } else {
    const nString = n.toString();
    if (nString.length % 2 === 0) {
      // Case 2: Split even numbers.
      const result1 = solveAndCache(
        Number(nString.slice(0, nString.length / 2)),
        iteration,
        cached
      );
      const result2 = solveAndCache(
        Number(nString.slice(nString.length / 2, nString.length)),
        iteration,
        cached
      );
      return result1 + result2;
    } else {
      // Case 3: Multiply with 2024.
      return solveAndCache(n * 2024, iteration, cached);
    }
  }
};

const solve1 = (fileName: string) => {
  const line = parse(fileName);
  const cached = {};
  let total = line.reduce(
    (subTotal, element) => subTotal + solveRecursively(element, 25, cached),
    0
  );
  return total;
};

const solve2 = (fileName: string) => {
  const line = parse(fileName);
  const cached = {};
  let total = line.reduce(
    (subTotal, element) => subTotal + solveRecursively(element, 75, cached),
    0
  );
  return total;
};

const main = (runExampleInput: boolean) => {
  const folderPath = import.meta.url
    .replace("file://", "")
    .replace("/solve.js", "");
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
