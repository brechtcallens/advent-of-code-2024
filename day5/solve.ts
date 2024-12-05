import fs from "fs";

const parse = (fileName: string) => {
  const input = fs.readFileSync(fileName, "utf8");

  const lines = input.split("\n");
  return lines.reduce<{
    rules: Record<number, Set<number>>;
    pages: number[][];
  }>(
    (acc, line) => {
      if (line.includes("|")) {
        const [n1, n2] = line
          .trim()
          .split("|")
          .map((nString) => parseInt(nString));
        if (!(n1 in acc.rules)) {
          acc.rules[n1] = new Set<number>();
        }
        acc.rules[n1].add(n2);
      } else if (line.includes(",")) {
        const numbers = line
          .trim()
          .split(",")
          .map((nString) => parseInt(nString));
        acc.pages.push(numbers);
      }
      return acc;
    },
    { rules: {}, pages: [] }
  );
};

const solve1 = (fileName: string) => {
  let total = 0;
  const input = parse(fileName);
  for (const page of input.pages) {
    const allCorrect = page.every((value, index) => {
      const after = input.rules[value];
      for (let i = 0; i < index; i++) {
        if (after && after.has(page[i])) {
          return false;
        }
      }
      return true;
    });
    if (allCorrect) {
      total += page[Math.floor(page.length / 2)];
    }
  }
  return total;
};

const solve2 = (fileName: string) => {
  let total = 0;
  const input = parse(fileName);
  for (const page of input.pages) {
    const original = [...page];
    page.sort((n1, n2) => {
      if (n1 in input.rules && input.rules[n1].has(n2)) {
        return -1;
      } else if (n2 in input.rules && input.rules[n2].has(n1)) {
        return 1;
      } else {
        return 0;
      }
    });

    if (JSON.stringify(original) !== JSON.stringify(page)) {
      total += page[Math.floor(page.length / 2)];
    }
  }
  return total;
};

const main = (runExampleInput: boolean) => {
  const folderPath = import.meta.url
    .replace("file://", "")
    .replace("/solve.ts", "");
  const filename = `${folderPath}/${
    runExampleInput ? "example_input" : "input"
  }`;
  console.log(`Solving ${runExampleInput ? "example" : "real"} input`);
  console.log(`Task 1: ${solve1(filename)}`);
  console.log(`Task 2: ${solve2(filename)}`);
};

// Run!
const RUN_EXAMPLE_INPUT = process.argv[2] === "example";
main(RUN_EXAMPLE_INPUT);
