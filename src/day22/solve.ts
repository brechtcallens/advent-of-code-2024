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

  const changesToValues: Record<string, number>[] = [];
  const changesOptions = new Set<string>();
  const changes: number[][] = [];

  for (const line of lines) {
    let secret = line;
    let prevValue = secret % 10n;

    const buyerChanges: number[] = [];
    const buyerChangesToValue: Record<string, number> = {};

    for (let it = 0; it < 2000 - 1; it++) {
      secret = nextSecret(secret);
      const nextValue = secret % 10n;

      buyerChanges.push(Number(nextValue - prevValue));
      if (buyerChanges.length >= 4) {
        const changesKey = buyerChanges
          .slice(buyerChanges.length - 4, buyerChanges.length)
          .join(",");
        if (!(changesKey in buyerChangesToValue)) {
          buyerChangesToValue[changesKey] = Number(nextValue);
        }
      }

      prevValue = nextValue;
    }

    changesToValues.push(buyerChangesToValue);
    Object.keys(buyerChangesToValue).forEach((change) =>
      changesOptions.add(change)
    );
    changes.push(buyerChanges);
  }

  let bestOption = undefined;
  let bestScore = Number.MIN_SAFE_INTEGER;
  const allChangeOptions = [...changesOptions];
  for (const changeOption of allChangeOptions) {
    let total = 0;
    changesToValues.forEach((changesToValue, index) => {
      if (changeOption in changesToValue) {
        total += changesToValue[changeOption];
      }
    });
    if (total > bestScore) {
      bestScore = total;
      bestOption = changeOption;
    }
  }

  return bestScore;
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
