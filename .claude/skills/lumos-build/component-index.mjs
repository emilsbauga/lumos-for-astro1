#!/usr/bin/env node
/**
 * Prints the component library's API, read from the source.
 *
 * The question asked before writing any markup is "what is there, and what
 * does it take?". Answering it by opening thirty-four files costs more than
 * the markup does, and answering it from memory is how a prop that was
 * renamed last release ends up in a page.
 *
 * Nothing is written. This reads src/components and prints.
 *
 * Usage:
 *   node component-index.mjs              every component, props and slots
 *   node component-index.mjs Section      one component, with its tooltips
 *   node component-index.mjs --names      just the import lines
 */

import { readdirSync, statSync, readFileSync, existsSync } from "node:fs";
import { join, relative, extname, basename } from "node:path";

const root = "src/components";

if (!existsSync(root)) {
  console.error(`No ${root} here. Run this from the project root.`);
  process.exit(1);
}
const args = process.argv.slice(2);
const namesOnly = args.includes("--names");
const wanted = args.find((a) => !a.startsWith("--"));

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (extname(full) === ".astro") out.push(full);
  }
  return out;
}

/* Props live inside the type declarations only. Scanning the whole
   frontmatter reads object literals as props: a lookup table of variant
   names is not an API. Brace matching keeps a discriminated union whole,
   since cutting at the first branch loses the props of every other one. */
function declarations(fm) {
  const blocks = [];
  for (const decl of fm.matchAll(/\b(interface|type)\s+(\w+)/g)) {
    let i = decl.index;
    let depth = 0;
    let started = false;
    for (; i < fm.length; i++) {
      const ch = fm[i];
      if (ch === "{" || ch === "(") { depth++; started = true; }
      else if (ch === "}" || ch === ")") {
        depth--;
        if (started && depth === 0 && decl[1] === "interface") { i++; break; }
      } else if (ch === ";" && depth === 0) break;
    }
    blocks.push(fm.slice(decl.index, i + 1));
  }
  return blocks;
}

/* `variant?: "columns"` in one branch of a union and `variant?: VariantName`
   in the widened alias beside it are the same prop said twice. Expanding the
   aliases that are plain unions of literals, then deduping the members, prints
   the one list a person would have written. */
function expandAliases(fm) {
  const map = new Map();
  for (const m of fm.matchAll(/\btype\s+(\w+)\s*=\s*([^;{}]+);/g)) {
    const rhs = m[2].replace(/\s+/g, " ").replace(/^\|\s*/, "").trim();
    if (/^("[^"]*"|\d+|true|false|number|string|boolean)(\s*\|\s*("[^"]*"|\d+|true|false|number|string|boolean))*$/.test(rhs)) {
      map.set(m[1], rhs);
    }
  }
  return map;
}

function tidyType(type, aliases) {
  let t = type;
  for (let pass = 0; pass < 3; pass++) {
    t = t.replace(/\b(\w+)\b/g, (word) => aliases.get(word) ?? word);
  }
  if (!t.includes("|")) return t;
  /* Only flatten a top-level union — a `Record<a | b, c>` is one type. */
  if (/[<({]/.test(t)) return t;
  return [...new Set(t.split("|").map((x) => x.trim()))].join(" | ");
}

const PROP = /(?:\/\*\*([\s\S]*?)\*\/\s*)?^(\s{2,8})([a-zA-Z_]\w*)(\?)?:\s*([^\n]+)$/gm;

function read(file) {
  const src = readFileSync(file, "utf8");
  const fm = src.startsWith("---") ? src.split("---")[1] : "";
  const body = src.slice(fm.length);
  const props = [];
  const seen = new Map();

  for (const block of declarations(fm)) {
    for (const m of block.matchAll(PROP)) {
      const [, doc, , name, optional, rawType] = m;
      const type = rawType.replace(/;$/, "").replace(/\s+/g, " ").trim();
      if (name === "type" && /^\s*(never|"[^"]*")/.test(type)) continue;
      /* `never` is a prop belonging to another variant branch — it is the
         union saying this combination does not typecheck, not a prop. */
      if (/^never$/.test(type)) continue;
      const tidy = doc
        ? doc.replace(/^\s*\*\s?/gm, "").replace(/\s+/g, " ").trim()
        : null;
      if (seen.has(name)) {
        /* A prop declared in several branches carries one type per branch. */
        const p = seen.get(name);
        if (!p.types.includes(type)) p.types.push(type);
        if (!p.doc && tidy) p.doc = tidy;
        continue;
      }
      const p = { name, types: [type], optional: !!optional, doc: tidy };
      seen.set(name, p);
      props.push(p);
    }
  }

  /* What a component forwards is part of its API: the element whose plain
     HTML attributes it accepts, or the component it passes props up to. */
  const forwards = [
    ...new Set([
      ...[...fm.matchAll(/HTMLAttributes<"(\w+)">/g)].map((m) => `<${m[1]}> attributes`),
      ...[...fm.matchAll(/ComponentProps<typeof (\w+)>/g)].map((m) => `${m[1]} props`),
    ]),
  ];

  const slots = new Set();
  for (const m of body.matchAll(/<slot\s+name="([^"]+)"/g)) slots.add(m[1]);
  for (const m of fm.matchAll(/slotContent\(\s*Astro\.slots\s*,\s*"([^"]+)"/g))
    slots.add(m[1]);
  if (/<slot(\s*\/?>|\s+(?!name)[^>]*>)/.test(body) ||
      /slotContent\(\s*Astro\.slots\s*\)/.test(fm)) {
    slots.add("default");
  }

  return {
    aliases: expandAliases(fm),
    name: basename(file, ".astro"),
    path: relative(process.cwd(), file),
    importPath: "@/" + relative("src", file).split("\\").join("/"),
    forwards,
    props,
    slots: [...slots].sort((a, b) => (a === "default" ? -1 : b === "default" ? 1 : a.localeCompare(b))),
  };
}

const all = walk(root).map(read);

if (namesOnly) {
  for (const c of all) {
    console.log(`import ${c.name} from "${c.importPath}";`);
  }
  process.exit(0);
}

const list = wanted
  ? all.filter((c) => c.name.toLowerCase() === wanted.toLowerCase() ||
                      c.name.toLowerCase().includes(wanted.toLowerCase()))
  : all;

if (!list.length) {
  console.error(`No component matching "${wanted}". Run without arguments for the list.`);
  process.exit(1);
}

const verbose = !!wanted;
let group = null;

for (const c of list) {
  const folder = c.path.split("/").slice(2, -1).join("/") || "(root)";
  if (!verbose && folder !== group) {
    group = folder;
    console.log(`\n${"─".repeat(64)}\n${folder}\n${"─".repeat(64)}`);
  }
  console.log(`\n${c.name}  ·  import ${c.name} from "${c.importPath}";`);
  if (c.forwards.length) console.log(`  forwards: ${c.forwards.join(", ")}`);
  if (c.slots.length) console.log(`  slots: ${c.slots.join(", ")}`);
  for (const p of c.props) {
    const type = tidyType(p.types.join(" | "), c.aliases);
    const short = type.length > 76 && !verbose ? type.slice(0, 73) + "…" : type;
    console.log(`  ${(p.name + (p.optional ? "?" : "")).padEnd(16)} ${short}`);
    if (verbose && p.doc) {
      for (const line of p.doc.split(/(?= - `)/)) {
        console.log(`      ${line.trim()}`);
      }
    }
  }
}

if (!verbose) {
  console.log(`\n${"─".repeat(64)}`);
  console.log(`${all.length} components. Pass a name for its tooltips: node component-index.mjs Grid`);
}
