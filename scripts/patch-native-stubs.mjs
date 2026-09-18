// This machine's Application Control policy blocks loading unsigned native
// .node binaries. next-intl's plugin eagerly requires @parcel/watcher and
// @swc/core (for an optional extraction feature we never enable), which
// crashes `next dev`/`next lint` on startup. Neither module's JS API is
// actually invoked by next-intl unless `experimental.extract` is configured
// (it isn't here), so we replace their nested copies with harmless
// pure-JS stubs. Re-runs automatically after every `npm install` via
// the "postinstall" script.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");

const stubs = [
  {
    dir: join(root, "node_modules/next-intl/node_modules/@parcel/watcher"),
    packageJson: { name: "@parcel/watcher", version: "2.6.0", main: "index.js" },
    indexJs: `async function subscribe() {
  return { unsubscribe: async () => {} };
}

async function unsubscribe() {}

async function getEventsSince() {
  return [];
}

async function writeSnapshot() {}

module.exports = { subscribe, unsubscribe, getEventsSince, writeSnapshot };
`,
  },
  {
    dir: join(root, "node_modules/next-intl/node_modules/@swc/core"),
    packageJson: { name: "@swc/core", version: "1.16.2", main: "index.js" },
    indexJs: `async function transform(source) {
  return { code: source, map: undefined, output: JSON.stringify(JSON.stringify({ results: JSON.stringify([]) })) };
}

module.exports = { transform };
`,
  },
];

for (const stub of stubs) {
  if (!existsSync(join(root, "node_modules/next-intl"))) continue;
  mkdirSync(stub.dir, { recursive: true });
  writeFileSync(join(stub.dir, "package.json"), JSON.stringify(stub.packageJson, null, 2) + "\n");
  writeFileSync(join(stub.dir, "index.js"), stub.indexJs);
  console.log(`[patch-native-stubs] stubbed ${stub.packageJson.name}`);
}
