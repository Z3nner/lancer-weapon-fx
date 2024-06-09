/**
 * Pack previously-unpacked JSON/JS files into a Foundry LDB.
 */

import fs from "fs";
import path from "path";

import {compilePack} from "@foundryvtt/foundryvtt-cli";
import chalk from "chalk";

import {DIR_PACKS, DIR_PACKS_SOURCE} from "./consts.mjs";
import {isMacroKey} from "./utils-pack.js";

if (!fs.existsSync(DIR_PACKS_SOURCE)) throw new Error(`Unpacked dir "${DIR_PACKS_SOURCE}" does not exists! Run "npm run db:unpack" first`);

// Discover pack source dirs
const packSourceDirs = fs.readdirSync(DIR_PACKS_SOURCE)
	.map(name => ({
		name,
		dirpath: path.join(DIR_PACKS_SOURCE, name),
	}))
	.filter(({dirpath}) => fs.statSync(dirpath).isDirectory());

// Pack packs
for (const {name, dirpath} of packSourceDirs) {
	const dirpathOut = path.join(DIR_PACKS, name);

	console.log(`Packing "${name}"`);
	console.group();
	await compilePack(
		dirpath,
		dirpathOut,
		{
			clean: true,
			log: true,
			recursive: true,
			transformEntry: (entry) => {
				if (!isMacroKey(entry._key)) return;

				// For macro entries, read the `"command"` in from a separate `.js` file
				const {command_source} = entry;
				entry.command = fs.readFileSync(command_source, "utf-8");
				delete entry.command_source;
				console.log(`Packed ${chalk.cyan(command_source)}`);
			},
		},
	);
	console.groupEnd();
}
