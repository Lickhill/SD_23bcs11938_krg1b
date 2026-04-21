import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("🔨 Building Prisma Client...");
const result = spawnSync("npx", ["prisma", "generate"], {
	stdio: "inherit",
	cwd: __dirname,
});

if (result.error || result.status !== 0) {
	console.error("❌ Failed to generate Prisma Client");
	process.exit(1);
}
console.log("✅ Prisma Client generated successfully!");
