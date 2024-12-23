import fs from "fs";

const parse = (fileName: string) => {
  const input = fs.readFileSync(fileName, "utf8");

  const rawConnections = input
    .split("\n")
    .map((line) => line.trim().split("-"))
    .sort();

  const connections: Record<string, Set<string>> = {};
  for (const [node1, node2] of rawConnections) {
    connections[node1] = (connections[node1] ?? new Set<string>()).add(node2);
    connections[node2] = (connections[node2] ?? new Set<string>()).add(node1);
  }

  return connections;
};

const solve1 = (fileName: string) => {
  const connections = parse(fileName);

  let total = 0;
  const vertices = [...Object.keys(connections)].sort();
  for (let i = 0; i < vertices.length; i++) {
    const first = vertices[i];
    const secondOptions = connections[first];
    for (const second of secondOptions) {
      if (first < second) {
        const thirdOptions = connections[second].intersection(
          connections[first]
        );
        for (const third of thirdOptions) {
          if (second < third) {
            if (first[0] === "t" || second[0] === "t" || third[0] === "t") {
              total++;
            }
          }
        }
      }
    }
  }

  return total;
};

const solve2 = (fileName: string) => {
  const connections = parse(fileName);

  const cliques = [
    ...Object.keys(connections).map((connection) => new Set([connection])),
  ];
  while (cliques.length > 1) {
    const current = cliques.shift();
    const firstNode = current.keys().next().value;
    const nextNodes = connections[firstNode];
    for (const nextNode of nextNodes) {
      if (!current.has(nextNode)) {
        const intersection = current.intersection(connections[nextNode]);
        if (intersection.size === current.size) {
          // Optimization: Only consider cliques in alphabetical order to not re-consider the same cliques.
          if ([...current].every((node) => node < nextNode)) {
            const newClique = new Set(current).add(nextNode);
            cliques.push(newClique);
          }
        }
      }
    }
  }

  return [...cliques.pop()].join(",");
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
