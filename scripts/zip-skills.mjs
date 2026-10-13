#!/usr/bin/env node
/**
 * Comprime cada skill de skills/ en su propio .zip, dentro de dist/
 * Se considera skill toda carpeta de skills/ que contenga un SKILL.md.
 *
 *   npm run zip:skills                      -> comprime todas
 *   npm run zip:skills -- ref-generator     -> solo las indicadas
 *
 * Resultado equivalente a "clic derecho > Comprimir": el zip contiene la
 * carpeta de la skill en su raíz (ref-generator.zip -> ref-generator/SKILL.md ...).
 *
 * Sin dependencias: escribe el ZIP (deflate) con zlib.
 */

import { deflateRawSync } from "node:zlib";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS_DIR = path.join(ROOT, "skills");
const OUT_DIR = path.join(ROOT, "dist");
const EXCLUDED_DIRS = new Set(["__pycache__", "node_modules", ".git", ".venv"]);
const EXCLUDED_FILES = new Set([".DS_Store", "Thumbs.db"]);
const EXCLUDED_EXTS = new Set([".pyc", ".pyo", ".zip"]);

// ---------------------------------------------------------------- CRC32

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

// ---------------------------------------------------------------- ZIP

/** Fecha/hora en formato MS-DOS (resolución de 2 s, hora local). */
function dosDateTime(date) {
  const year = Math.max(1980, date.getFullYear());
  const time = (date.getHours() << 11) | (date.getMinutes() << 5) | (date.getSeconds() >> 1);
  const day = ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { time: time & 0xffff, date: day & 0xffff };
}

/**
 * @param {{ name: string, data: Buffer|null, mtime: Date }[]} entries
 *   data === null => entrada de directorio (el nombre debe acabar en "/").
 */
function buildZip(entries) {
  const chunks = [];
  const central = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBuf = Buffer.from(entry.name, "utf8");
    const utf8Flag = nameBuf.toString("utf8") === entry.name && /[^\x00-\x7f]/.test(entry.name);
    const flags = utf8Flag ? 0x0800 : 0;
    const isDir = entry.data === null;
    const raw = isDir ? Buffer.alloc(0) : entry.data;

    let method = 0;
    let payload = raw;
    if (!isDir && raw.length > 0) {
      const deflated = deflateRawSync(raw, { level: 9 });
      if (deflated.length < raw.length) {
        method = 8;
        payload = deflated;
      }
    }

    const crc = isDir ? 0 : crc32(raw);
    const { time, date } = dosDateTime(entry.mtime);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0); // firma local file header
    local.writeUInt16LE(20, 4); // versión necesaria (2.0)
    local.writeUInt16LE(flags, 6);
    local.writeUInt16LE(method, 8);
    local.writeUInt16LE(time, 10);
    local.writeUInt16LE(date, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(payload.length, 18);
    local.writeUInt32LE(raw.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28); // sin campo extra

    chunks.push(local, nameBuf, payload);

    const header = Buffer.alloc(46);
    header.writeUInt32LE(0x02014b50, 0); // firma central directory
    header.writeUInt16LE(0x031e, 4); // versión creada por (UNIX, 3.0)
    header.writeUInt16LE(20, 6);
    header.writeUInt16LE(flags, 8);
    header.writeUInt16LE(method, 10);
    header.writeUInt16LE(time, 12);
    header.writeUInt16LE(date, 14);
    header.writeUInt32LE(crc, 16);
    header.writeUInt32LE(payload.length, 20);
    header.writeUInt32LE(raw.length, 24);
    header.writeUInt16LE(nameBuf.length, 28);
    header.writeUInt16LE(0, 30); // extra
    header.writeUInt16LE(0, 32); // comentario
    header.writeUInt16LE(0, 34); // disco
    header.writeUInt16LE(0, 36); // atributos internos
    // atributos externos: permisos UNIX en los 16 bits altos + flag DOS de directorio
    header.writeUInt32LE(isDir ? (((0o040755 << 16) | 0x10) >>> 0) : (0o100644 << 16) >>> 0, 38);
    header.writeUInt32LE(offset, 42);

    central.push(header, nameBuf);
    offset += local.length + nameBuf.length + payload.length;
  }

  const centralBuf = Buffer.concat(central);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // firma EOCD
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralBuf.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...chunks, centralBuf, eocd]);
}

// ---------------------------------------------------------------- walk

/** Recorre dir y devuelve entradas ZIP con prefijo `<skill>/`, ordenadas. */
function collect(dir, prefix) {
  const entries = [];
  const names = fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1));

  for (const dirent of names) {
    const abs = path.join(dir, dirent.name);
    const stat = fs.statSync(abs);

    if (dirent.isDirectory()) {
      if (EXCLUDED_DIRS.has(dirent.name)) continue;
      entries.push({ name: `${prefix}${dirent.name}/`, data: null, mtime: stat.mtime });
      entries.push(...collect(abs, `${prefix}${dirent.name}/`));
      continue;
    }
    if (!dirent.isFile()) continue;
    if (EXCLUDED_FILES.has(dirent.name)) continue;
    if (EXCLUDED_EXTS.has(path.extname(dirent.name).toLowerCase())) continue;

    entries.push({ name: `${prefix}${dirent.name}`, data: fs.readFileSync(abs), mtime: stat.mtime });
  }

  return entries;
}

// ---------------------------------------------------------------- main

function main() {
  const all = fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !EXCLUDED_DIRS.has(d.name))
    .filter((d) => fs.existsSync(path.join(SKILLS_DIR, d.name, "SKILL.md")))
    .map((d) => d.name);

  const wanted = process.argv.slice(2).filter((a) => !a.startsWith("-"));
  const unknown = wanted.filter((name) => !all.includes(name));
  if (unknown.length) {
    console.error(`Skills no encontradas: ${unknown.join(", ")}`);
    console.error(`Disponibles: ${all.join(", ")}`);
    process.exit(1);
  }

  const targets = wanted.length ? wanted : all;
  if (!targets.length) {
    console.log("No hay skills que comprimir.");
    return;
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const skill of targets) {
    const src = path.join(SKILLS_DIR, skill);
    const out = path.join(OUT_DIR, `${skill}.zip`);
    const entries = collect(src, `${skill}/`);
    const files = entries.filter((e) => e.data !== null).length;

    fs.writeFileSync(out, buildZip(entries));
    const kb = (fs.statSync(out).size / 1024).toFixed(1);
    console.log(`✓ ${skill}.zip  (${files} archivos, ${kb} KB)`);
  }

  console.log(`\n${targets.length} skill(s) comprimidas en ${path.relative(ROOT, OUT_DIR)}/`);
}

main();
