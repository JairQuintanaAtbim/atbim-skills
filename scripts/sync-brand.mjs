#!/usr/bin/env node
/**
 * Copia la marca de atbim-brand a las skills que la llevan como respaldo, para que sean idénticas.
 *
 *   npm run sync:brand        (también se ejecuta antes de npm run zip:skills)
 *
 * Entra en la sincronización toda skill de skills/ cuyo SKILL.md tenga los marcadores
 *   <!-- atbim-brand:reglas:inicio --> ... <!-- atbim-brand:reglas:fin -->
 * y recibe de atbim-brand:
 *   - scripts/atbim_brand.js y los assets de marca (fondo y logo)
 *   - el bloque de reglas de atbim-brand/SKILL.md que va entre esos marcadores
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS_DIR = path.join(ROOT, "skills");
const BRAND = "atbim-brand";
const FILES = ["scripts/atbim_brand.js", "assets/background-a4.png", "assets/logo.png"];
const START = "<!-- atbim-brand:reglas:inicio -->";
const END = "<!-- atbim-brand:reglas:fin -->";
const BLOCK = new RegExp(`${START}[\\s\\S]*?${END}`);

function rulesBlock(markdown, file) {
  const match = markdown.match(BLOCK);
  if (!match) throw new Error(`${file}: faltan los marcadores ${START} ... ${END}`);
  return match[0];
}

function main() {
  const brandDir = path.join(SKILLS_DIR, BRAND);
  const block = rulesBlock(fs.readFileSync(path.join(brandDir, "SKILL.md"), "utf8"), `${BRAND}/SKILL.md`)
    .replace(/\r\n/g, "\n");

  const targets = fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== BRAND)
    .map((d) => d.name)
    .filter((name) => {
      const skillMd = path.join(SKILLS_DIR, name, "SKILL.md");
      return fs.existsSync(skillMd) && fs.readFileSync(skillMd, "utf8").includes(START);
    });

  if (!targets.length) {
    console.log("Ninguna skill lleva la marca de respaldo.");
    return;
  }

  for (const skill of targets) {
    const changed = [];

    for (const rel of FILES) {
      const data = fs.readFileSync(path.join(brandDir, rel));
      const dst = path.join(SKILLS_DIR, skill, rel);
      if (fs.existsSync(dst) && fs.readFileSync(dst).equals(data)) continue;
      fs.mkdirSync(path.dirname(dst), { recursive: true });
      fs.writeFileSync(dst, data);
      changed.push(rel);
    }

    // Respeta los saltos de línea del SKILL.md destino (CRLF/LF)
    const skillMd = path.join(SKILLS_DIR, skill, "SKILL.md");
    const text = fs.readFileSync(skillMd, "utf8");
    rulesBlock(text, `${skill}/SKILL.md`);
    const eol = text.includes("\r\n") ? "\r\n" : "\n";
    const next = text.replace(BLOCK, () => block.replace(/\n/g, eol));
    if (next !== text) {
      fs.writeFileSync(skillMd, next);
      changed.push("SKILL.md (reglas)");
    }

    console.log(changed.length ? `✓ ${skill}: ${changed.join(", ")}` : `= ${skill}: ya sincronizada`);
  }
}

try {
  main();
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
