import fs from "fs";

const parse = (fileName: string) => {
  const input = fs.readFileSync(fileName, "utf8");

  const line = input.split("\n")[0].trim().split("").map(Number);
  const disk = line.reduce((acc, value, index) => {
    const symbol = index % 2 === 0 ? Math.round(index / 2).toString() : ".";
    const symbolArray: string[] = Array(value).fill(symbol);
    return [...acc, ...symbolArray];
  }, [] as string[]);

  return disk;
};

const solve1 = (fileName: string) => {
  const disk = parse(fileName);
  const size = disk.length;

  let iStart = 0;
  let iEnd = size - 1;
  while (iStart < iEnd) {
    // Find next "." from start
    while (iStart < iEnd && disk[iStart] !== ".") {
      iStart++;
    }
    // Find next number from end
    while (iEnd > iStart && disk[iEnd] === ".") {
      iEnd--;
    }
    // Replace the two
    disk[iStart] = disk[iEnd];
    disk[iEnd] = ".";
  }

  let checkSum = 0;
  for (let i = 0; i < iEnd; i++) {
    checkSum += i * Number(disk[i]);
  }
  return checkSum;
};

const solve2 = (fileName: string) => {
  const disk = parse(fileName);
  const size = disk.length;

  let iStart = 0;
  let iEnd = size - 1;
  while (iEnd > 0) {
    // Find next "." from start
    while (iStart < iEnd && disk[iStart] !== ".") {
      iStart++;
    }

    let iStartLength = 1;
    while (
      iStart + iStartLength < size &&
      disk[iStart + iStartLength] === "."
    ) {
      iStartLength++;
    }

    // Find next number from end
    while (iEnd > iStart && disk[iEnd] === ".") {
      iEnd--;
    }

    let iEndLength = 1;
    while (iEnd - iEndLength > 0 && disk[iEnd - iEndLength] == disk[iEnd]) {
      iEndLength++;
    }

    if (iStart < iEnd) {
      if (iEndLength <= iStartLength) {
        for (let i = 0; i < iEndLength; i++) {
          disk[iStart + i] = disk[iEnd - i];
          disk[iEnd - i] = ".";
        }
        iStart = 0;
        iEnd = iEnd - iEndLength;
      } else {
        iStart = iStart + iStartLength;
        if (iEnd < iStart) {
          iEnd = iEnd - iEndLength;
        }
      }
    } else {
      iStart = 0;
      iEnd = iEnd - iEndLength;
    }
  }

  let checkSum = 0;
  for (let i = 0; i < size; i++) {
    if (disk[i] !== ".") {
      checkSum += i * Number(disk[i]);
    }
  }
  return checkSum;
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
