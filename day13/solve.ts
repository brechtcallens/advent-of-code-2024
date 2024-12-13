import fs from "fs";

const parse = (fileName: string) => {
  const input = fs.readFileSync(fileName, "utf8");

  const blocks = input.split("\n\n").map((block) => {
    const [aX, aY, bX, bY, totalX, totalY] = block
      .match(/([0-9]+)/gm)
      ?.map(Number) as [number, number, number, number, number, number];
    return { aX, aY, bX, bY, totalX, totalY };
  });

  return blocks;
};

const solve = (fileName: string, part2: boolean = false) => {
  const blocks = parse(fileName);

  // A * aX + B * bX = totalX
  // A * aY + B * bY = totalY
  // -> A = ((totalX - B * bX) / aX)
  // -> ((totalX - B * bX) / aX) * aY + B * bY = totalY
  // -> B = (totalY - (aY * totalX) / aX) / (bY - (aY * bX) / aX)
  const solutions = blocks.map((block) => {
    if (part2) {
      block.totalX += 10000000000000;
      block.totalY += 10000000000000;
    }

    const B = Math.round(
      (block.totalY - (block.aY * block.totalX) / block.aX) /
        (block.bY - (block.aY * block.bX) / block.aX)
    );
    const A = Math.round((block.totalX - B * block.bX) / block.aX);

    const xMatches = A * block.aX + B * block.bX === block.totalX;
    const yMatches = A * block.aY + B * block.bY === block.totalY;
    const valid = 0 <= A && 0 <= B && (part2 || (A <= 100 && B <= 100));
    if (xMatches && yMatches && valid) {
      return 3 * A + B;
    } else {
      return 0;
    }
  });

  return solutions.reduce((acc, val) => acc + val, 0);
};

const solve1 = (fileName: string) => solve(fileName, false);

const solve2 = (fileName: string) => solve(fileName, true);

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
