/**
 * Unpack the current `.db` files into human-readable JSON and JS files.
 */

import * as fs from "fs";
import * as path from "path";
import {DIR_PACKS, DIR_PACKS_SOURCE} from "./consts.mjs";

fs.mkdirSync(DIR_PACKS_SOURCE, {recursive: true});

// Remove any existing unpacked data
fs.readdirSync(DIR_PACKS_SOURCE)
    .forEach(dir => {
        const dirPath = path.join(DIR_PACKS_SOURCE, dir);
        fs.readdirSync(dirPath)
            .forEach(fname => fs.unlinkSync(`${dirPath}/${fname}`));
        fs.rmdirSync(dirPath);
    });

// Unpack `.db` files
fs.readdirSync(DIR_PACKS)
    .filter(it => it.endsWith(".db"))
    .forEach(packFilename => {
        const packPath = path.join(DIR_PACKS, packFilename);
        const lines = fs.readFileSync(packPath, "utf-8")
            .split("\n")
            .map(it => it.trim())
            .filter(Boolean);

        const outDir = path.join(DIR_PACKS_SOURCE, packFilename);
        fs.mkdirSync(outDir, {recursive: true});

        lines
            .forEach(line => {
                const json = JSON.parse(line);

                const ptName = `${json.name}.${json._id}`;

                const outPathScript = path.join(outDir, `${ptName}.js`);
                const outPathJson = path.join(outDir, `${ptName}.json`);

                fs.writeFileSync(outPathScript, json.command, "utf-8");
                delete json.command;
                fs.writeFileSync(outPathJson, JSON.stringify(json, null, 4), "utf-8");

                console.log(`Unpacked "${json.name}"`);
            });
    });
