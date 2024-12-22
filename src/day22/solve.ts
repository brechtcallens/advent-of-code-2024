import fs from "fs";

const parse = (fileName: string) => {
  const input = fs.readFileSync(fileName, "utf8");
  const lines = input.split("\n").map(BigInt);
  return lines;
};

const MOD = 16777216n;

const nextSecret = (secret: bigint) => {
  let newSecret = secret;
  newSecret ^= newSecret << 6n;
  newSecret = newSecret % MOD;
  newSecret ^= newSecret >> 5n;
  newSecret = newSecret % MOD;
  newSecret ^= newSecret << 11n;
  newSecret = newSecret % MOD;
  return newSecret;
};

const solve1 = (fileName: string) => {
  const lines = parse(fileName);
  let total = 0n;
  for (const line of lines) {
    let secret = line;
    for (let it = 0; it < 2000; it++) {
      secret = nextSecret(secret);
    }
    total += secret;
  }
  return total;
};

const solve2 = (fileName: string) => {
  const lines = parse(fileName);
  // Solve!
  return `${lines[0]}, ${lines.length}`;
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
