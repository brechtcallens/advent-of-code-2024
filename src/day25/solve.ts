import fs from "fs";

const parse = (fileName: string) => {
  const input = fs.readFileSync(fileName, "utf8");

  const { locks, keys } = input.split("\n\n").reduce(
    (acc, value) => {
      const lines = value.split("\n");
      const rows = lines.length;
      const cols = lines[0].length;
      const isLock = lines[0][0] === "#";

      const hashAmounts = Array.from({ length: cols }).map((_, col) => {
        let amount = -1;
        for (let row = 0; row < rows; row++) {
          if (lines[row][col] === "#") {
            amount++;
          }
        }
        return amount;
      });

      acc[isLock ? "locks" : "keys"].push(hashAmounts);

      return acc;
    },
    { locks: [], keys: [] } as { locks: number[][]; keys: number[][] }
  );

  return { locks, keys };
};

const solve1 = (fileName: string) => {
  const { locks, keys } = parse(fileName);

  let total = 0;
  for (const lock of locks) {
    for (const key of keys) {
      const keyFitsInLock = lock.every(
        (lockValue, index) => lockValue + key[index] <= 5
      );
      if (keyFitsInLock) {
        total++;
      }
    }
  }
  // Solve!
  return total;
};

const main = (runExampleInput: boolean) => {
  const folderPath = import.meta.url
    .replace("file://", "")
    .replace(/solve\.(js|ts)/, "");
  const filename = `${folderPath}/${
    runExampleInput ? "example_input" : "input"
  }`;
  console.log(`Solving ${runExampleInput ? "example" : "real"} input`);
  const funcs = [solve1];
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
