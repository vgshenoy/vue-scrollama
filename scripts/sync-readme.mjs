import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const repoRoot = process.cwd();
const packageReadme = path.join(repoRoot, "packages/vue-scrollama/README.md");
const rootReadme = path.join(repoRoot, "README.md");
const checkOnly = process.argv.includes("--check");

const [packageContent, rootContent] = await Promise.all([
  fs.readFile(packageReadme, "utf8"),
  fs.readFile(rootReadme, "utf8"),
]);

if (checkOnly) {
  if (packageContent !== rootContent) {
    console.error("README drift detected.");
    console.error("Run `pnpm run sync:readme` and commit the updated package README.");
    process.exit(1);
  }

  console.log("README files are in sync.");
  process.exit(0);
}

await fs.writeFile(packageReadme, rootContent, "utf8");
console.log("Synced README.md -> packages/vue-scrollama/README.md");
