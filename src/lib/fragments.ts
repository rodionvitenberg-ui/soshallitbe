import fs from "node:fs";
import path from "node:path";

const fragmentsDir = path.join(process.cwd(), "src/fragments");

/**
 * Load a preserved production HTML fragment by filename.
 * Engine is hard-bound to ids/classes inside these files — do not "clean" markup.
 */
export function loadFragment(filename: string): string {
  const filePath = path.join(fragmentsDir, filename);
  return fs.readFileSync(filePath, "utf8");
}
