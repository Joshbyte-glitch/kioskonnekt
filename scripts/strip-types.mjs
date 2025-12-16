import fs from "fs";
import path from "path";
import ts from "typescript";

const roots = ["client/src", "server", "shared"];
const extraFiles = [
  "vite.config.js",
  "tailwind.config.js",
  "drizzle.config.js",
];
const skipDirs = new Set(["node_modules", "dist", "build", ".git", ".turbo", "tmp"]);

const shouldProcess = (file) => /\.(jsx|js)$/.test(file);

function processFile(file) {
  const source = fs.readFileSync(file, "utf8");
  const virtualName = file.endsWith(".jsx")
    ? file.replace(/\.jsx$/, ".tsx")
    : file.replace(/\.js$/, ".ts");

  const result = ts.transpileModule(source, {
    compilerOptions: {
      jsx: ts.JsxEmit.Preserve,
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      allowJs: true,
      esModuleInterop: true,
    },
    fileName: virtualName,
    reportDiagnostics: false,
  });

  fs.writeFileSync(file, result.outputText, "utf8");
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (shouldProcess(full)) {
      processFile(full);
    }
  }
}

for (const root of roots) {
  walk(root);
}

for (const file of extraFiles) {
  if (fs.existsSync(file)) processFile(file);
}

