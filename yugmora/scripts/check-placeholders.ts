// scripts/check-placeholders.ts — Find unfilled placeholders in /content
import * as fs from "fs";
import * as path from "path";

const contentDir = path.join(process.cwd(), "content");
const bracketRegex = /\[([^\]]+)\]/g;

let total = 0;

function scanFile(filePath: string) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  lines.forEach((line, i) => {
    let match;
    while ((match = bracketRegex.exec(line)) !== null) {
      // Skip type annotations and array access
      if (match[1].match(/^(string|number|boolean|null|undefined)/)) continue;
      if (match[1].match(/^\d+$/)) continue;

      const relative = path.relative(process.cwd(), filePath);
      console.log(`  ${relative}:${i + 1}  →  [${match[1]}]`);
      total++;
    }
  });
}

function walkDir(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(full);
    } else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
      scanFile(full);
    }
  }
}

console.log("\n🔍 Scanning for unfilled placeholders in /content...\n");
walkDir(contentDir);
console.log(`\n📊 Total placeholders found: ${total}\n`);

if (total > 0) {
  console.log("⚠️  Replace these with real data before launch.\n");
}
