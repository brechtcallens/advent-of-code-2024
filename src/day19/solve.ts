import fs from "fs";

const parse = (fileName: string) => {
  const input = fs.readFileSync(fileName, "utf8");

  const [firstInput, secondInput] = input.split("\n\n");
  const towels = firstInput.split(",").map((item) => item.trim());
  const designs = secondInput.split("\n").map((item) => item.trim());

  return { towels, designs };
};

const solveDynamicProgramming = (towels: string[], design: string) => {
  // Cheated: I saw that you could use Dynamic Programming and then knew what to do... :(
  const dp = [1, ...new Array<number>(design.length).fill(0)];
  for (let it = 0; it < dp.length; it++) {
    for (const towel of towels) {
      if (
        it + towel.length < dp.length &&
        design.slice(it, it + towel.length) === towel
      ) {
        dp[it + towel.length] += dp[it];
      }
    }
  }
  return dp[dp.length - 1];
};

const solve1 = (fileName: string) => {
  const { towels, designs } = parse(fileName);

  const total = designs.reduce(
    (subTotal, design) =>
      subTotal + (solveDynamicProgramming(towels, design) > 0 ? 1 : 0),
    0
  );

  // // Regex solution which only works with Node flag `--enable-experimental-regexp-engine-on-excessive-backtracks`
  // const total = designs.reduce((subTotal, design) => {
  //   const re = new RegExp(`^(?:${towels.join("|")})+$`, "");
  //   return re.test(design) ? subTotal + 1 : subTotal;
  // }, 0);

  return total;
};

const solve2 = (fileName: string) => {
  const { towels, designs } = parse(fileName);

  const total = designs.reduce(
    (subTotal, design) => subTotal + solveDynamicProgramming(towels, design),
    0
  );

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
