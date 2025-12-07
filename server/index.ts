import { spawn } from "child_process";

const port = process.env.PORT || "5000";

console.log(`Starting Next.js on port ${port}...`);

const next = spawn("npx", ["next", "dev", "-p", port], {
  stdio: "inherit",
  shell: true,
});

next.on("error", (err) => {
  console.error("Failed to start Next.js:", err);
  process.exit(1);
});

next.on("close", (code) => {
  process.exit(code || 0);
});
