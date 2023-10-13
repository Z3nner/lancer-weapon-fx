/**
 * Pack previously-unpacked JSON/JS files into a Foundry `.db`
 */

import * as fs from "fs";
import * as path from "path";
import {DIR_PACKS, DIR_PACKS_SOURCE} from "./consts.mjs";

if (!fs.existsSync(DIR_PACKS_SOURCE)) throw new Error(`Unpacked dir "${DIR_PACKS_SOURCE}" does not exists! Run "npm run db:unpack" first`);

// Read source dir; for each sub-dir, make a `.db` file from the contents
fs.readdirSync(DIR_PACKS_SOURCE)
    .forEach(dir => {
        const dirPath = path.join(DIR_PACKS_SOURCE, dir);
        const docs = fs.readdirSync(dirPath)
            .filter(fname => fname.endsWith(".json"))
            .sort((a, b) => a.localeCompare(b, {sensitivity: "base"}))
            .map(fname => {
                const jsFilename = fname.replace(".json", ".js");
                const json = JSON.parse(fs.readFileSync(path.join(dirPath, fname), "utf-8"));
                const command = fs.readFileSync(path.join(dirPath, jsFilename), "utf-8");
                return {
                    ...json,
                    command,
                };
            });
        fs.writeFileSync(
            path.join(DIR_PACKS, dir),
            docs
                .map(json => JSON.stringify(json))
                .join("\n"),
            "utf-8",
        );
        console.log(`Packed ${docs.length} documents into ${dir}`);
    });
