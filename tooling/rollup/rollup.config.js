import fs from "fs";
import path from "path";
import copy from "rollup-plugin-copy";
import { getBuildPath } from "./foundry-path.js";
import { pluginWatch } from "./plugin-watch.js";
import process from "process";

const packageJson = JSON.parse(fs.readFileSync("module.json", "utf-8"));

const buildPath = getBuildPath(packageJson.id);

console.log(`Bundling to ${buildPath}`);

const _FILES_COPY_AND_WATCH = ["module.json"];
const _FILES_COPY_ONCE = [];

const _DIRS_COPY_AND_WATCH = [
    "advisories",
    "icons",
    "lang",
    "scripts",
    "sprites",
    "soundfx",
    "video",
    "templates",
    "css",
    "tours",
];
const _DIRS_COPY_ONCE = [
    // Avoid watching the `packs` dir, as it can only be updated when the world is shut down.
    "packs",
];

export default {
    input: ["scripts/WeaponFX.js"],
    output: {
        file: path.join(buildPath, "WeaponFX.bundle.js"),
    },
    plugins: [
        copy({
            targets: [
                ..._FILES_COPY_AND_WATCH.map(fname => ({ src: fname, dest: buildPath })),
                ..._DIRS_COPY_AND_WATCH.map(dir => ({ src: `${dir}/*`, dest: path.join(buildPath, dir) })),
            ],
        }),
        copy({
            copyOnce: true,
            copySync: true,
            targets: [
                ..._FILES_COPY_ONCE.map(fname => ({ src: fname, dest: buildPath })),
                ..._DIRS_COPY_ONCE.map(dir => ({ src: `${dir}/*`, dest: path.join(buildPath, dir) })),
            ],
        }),
        ...[
            process.env.NODE_ENV === "production"
                ? null
                : pluginWatch({
                      include: [
                          ..._FILES_COPY_AND_WATCH.map(fname => path.join(process.cwd(), fname)),
                          ..._DIRS_COPY_AND_WATCH.map(dir => path.join(process.cwd(), dir, `**`)),
                      ],
                  }),
        ].filter(Boolean),
    ],
    watch: {
        clearScreen: false,
    },
};
