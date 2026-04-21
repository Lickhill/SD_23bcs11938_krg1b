#!/usr/bin/env node
import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import os from "os";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("📦 Backend Startup Process\n");
console.log(`📁 Working directory: ${__dirname}\n`);

function printSpawnFailure(prefix, result) {
	console.error(`\n❌ ${prefix}`);
	if (result?.error) {
		console.error(`   Spawn error: ${result.error.message}`);
		if (result.error.code) console.error(`   Code: ${result.error.code}`);
	}
	if (typeof result?.status === "number") {
		console.error(`   Exit code: ${result.status}`);
	}
	if (result?.signal) {
		console.error(`   Signal: ${result.signal}`);
	}
}

function ensureDir(p) {
	try {
		fs.mkdirSync(p, { recursive: true });
		return true;
	} catch (e) {
		console.error(`❌ Failed to create directory: ${p}`);
		console.error(`   ${e.message}`);
		return false;
	}
}

// --- Preflight: ensure writable cache/tmp locations (prevents ENOENT like /home/<user>/.npm) ---
const writableBase = process.env.TMPDIR || os.tmpdir();
const npmCacheDir = path.join(writableBase, "npm-cache");
const npmConfigTmp = path.join(writableBase, "npm-tmp");

console.log("🧰 Preparing writable npm cache/temp dirs...");
if (!ensureDir(npmCacheDir) || !ensureDir(npmConfigTmp)) {
	console.error(
		"❌ Cannot prepare writable temp directories required for Prisma generation.",
	);
	process.exit(1);
}
console.log(`✅ npm cache: ${npmCacheDir}`);
console.log(`✅ npm tmp:   ${npmConfigTmp}\n`);

// Check if node_modules exists
console.log("🔍 Checking dependencies...");
if (!fs.existsSync(path.join(__dirname, "node_modules"))) {
	console.error(
		"❌ node_modules not found. This should not happen on Vercel after install.",
	);
	console.error(
		"   Fix: Ensure Vercel Install Command is 'npm install' and Root Directory is set to backend.",
	);
	process.exit(1);
}
console.log("✅ Dependencies found\n");

// Check if prisma schema exists
console.log("🔍 Checking Prisma schema...");
const prismaSchemaPath = path.join(__dirname, "prisma", "schema.prisma");
if (!fs.existsSync(prismaSchemaPath)) {
	console.error(`❌ Prisma schema not found at: ${prismaSchemaPath}`);
	console.error(
		"   Fix: Commit prisma/schema.prisma and ensure Vercel Root Directory is backend.",
	);
	process.exit(1);
}
console.log(`✅ Prisma schema found at: ${prismaSchemaPath}\n`);

// Generate Prisma Client
console.log("🔨 Generating Prisma Client...");
console.log(
	"   (Goal: run prisma from already-installed dependencies; avoid fetching from registry at runtime)",
);

const envForPrisma = {
	...process.env,
	NODE_ENV: "production",
	// Force npm to use writable locations. This is the common root cause of the ENOENT you saw.
	npm_config_cache: npmCacheDir,
	npm_config_tmp: npmConfigTmp,
	NPM_CONFIG_CACHE: npmCacheDir,
	NPM_CONFIG_TMP: npmConfigTmp,
};

// Prefer `npm run build` (which should call prisma generate) so npm uses local deps.
// Fallback: `npx --no-install prisma generate` (uses local prisma only; won't download).
let generateResult = spawnSync("npm", ["run", "build"], {
	cwd: __dirname,
	stdio: "inherit",
	env: envForPrisma,
	shell: true,
});

if (generateResult.error || generateResult.status !== 0) {
	printSpawnFailure(
		"'npm run build' failed while generating Prisma Client.",
		generateResult,
	);
	console.error("\n↪ Trying fallback: npx --no-install prisma generate");
	generateResult = spawnSync("npx", ["--no-install", "prisma", "generate"], {
		cwd: __dirname,
		stdio: "inherit",
		env: envForPrisma,
		shell: true,
	});
}

if (generateResult.error || generateResult.status !== 0) {
	printSpawnFailure("Prisma generation failed.", generateResult);
	console.error(
		"\nMost likely causes for your specific error (ENOENT mkdir /home/...):",
	);
	console.error(
		"- Vercel runtime cannot write to the default npm cache directory",
	);
	console.error(
		"- A start-time command is trying to download packages from npm (npx without --no-install)",
	);
	console.error("\nFix checklist:");
	console.error(
		"1) In Vercel: Set Root Directory to 'backend' (important in monorepos)",
	);
	console.error(
		"2) In Vercel: Build Command should be 'npm run build' (or 'npm install && npm run build')",
	);
	console.error(
		"3) In Vercel: Do NOT set Build Command to 'node server.js' (that skips build)",
	);
	console.error(
		"4) Ensure 'prisma' is in dependencies/devDependencies and committed 'prisma/schema.prisma' exists",
	);
	console.error(
		"5) Ensure DATABASE_URL is set in Vercel Environment Variables (even though generate doesn't connect, app will)",
	);
	process.exit(1);
}

console.log("\n✅ Prisma Client generated successfully!\n");

// Verify Prisma Client files
console.log("🔍 Verifying Prisma Client files...");
const prismaClientPath = path.join(
	__dirname,
	"node_modules",
	".prisma",
	"client",
);
if (!fs.existsSync(prismaClientPath)) {
	console.error(`❌ Prisma Client files not found at: ${prismaClientPath}`);
	console.error(
		"   Prisma generation may have succeeded partially but did not write client files.",
	);
	process.exit(1);
}
console.log(`✅ Prisma Client verified at: ${prismaClientPath}\n`);

// Start the server
console.log("🚀 Starting Express server...\n");
const serverResult = spawnSync("node", ["server.js"], {
	stdio: "inherit",
	cwd: __dirname,
	env: { ...process.env, NODE_ENV: "production" },
});

if (serverResult.error || serverResult.status !== 0) {
	printSpawnFailure("Server exited unexpectedly.", serverResult);
	process.exit(serverResult.status || 1);
}

process.exit(0);
