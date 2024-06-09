/**
 * Unpack the current `.db` files into human-readable JSON and JS files.
 */

import fs from "fs";
import path from "path";

import {extractPack} from "@foundryvtt/foundryvtt-cli";
import chalk from "chalk";

import {DIR_PACKS, DIR_PACKS_SOURCE} from "./consts.mjs";
import {getSafeFilename} from "./utils.js";
import {isMacroKey} from "./utils-pack.js";

const _UNWANTED_DOC_KEYS = [
	"author",
	"ownership",
	"flags",
	"_stats",
];

// Discover pack dirs
const packDirs = fs.readdirSync(DIR_PACKS)
	.map(name => ({
		name,
		dirpath: path.join(DIR_PACKS, name),
	}))
	.filter(({dirpath}) => fs.statSync(dirpath).isDirectory());

// Unpack packs
for (const {name, dirpath} of packDirs) {
	const dirpathOut = path.join(DIR_PACKS_SOURCE, name);

	console.log(`Unpacking "${name}"`);
	console.group();

	const entryToFolder = {};
	const folders = {};

	await extractPack(
		dirpath,
		dirpathOut,
		{
			clean: true,
			log: true,
			transformEntry: (entry) => {
				entryToFolder[entry._id] = entry.folder;

				_UNWANTED_DOC_KEYS.forEach(key => delete entry[key]);

				if (entry._key.startsWith("!folders!")) {
					folders[entry._id] = {
						name: entry.name,
						folder: entry.folder,
					};
					return;
				}

				if (!isMacroKey(entry._key)) return;

				// For macro entries, write the `"command"` out as a separate `.js` file
				const scriptFilename = `${getSafeFilename(`${entry.name}.${entry._id}`)}.js`;
				fs.writeFileSync(path.join(dirpathOut, scriptFilename), entry.command, "utf-8");
				console.log(`Wrote ${chalk.cyan(scriptFilename)}`);
				delete entry.command;
			},
		},
	);

	// Folderize files
	const getDirPathParts = (json, stack) => {
		stack ||= [];
		if (!json.folder) return stack;
		stack.unshift(folders[json.folder].name);
		return getDirPathParts(folders[json.folder], stack);
	};

	fs.readdirSync(dirpathOut)
		.filter(name => name.endsWith(".json"))
		.forEach(name => {
			const fpath = path.join(dirpathOut, name);
			const json = JSON.parse(fs.readFileSync(fpath, "utf-8"));

			const dirPathParts = getDirPathParts(json);

			// Skip documents which are not in a folder, and are not a macro
			if (!dirPathParts.length && !isMacroKey(json._key)) return;

			const dirPath = path.join(dirpathOut, ...dirPathParts);
			fs.mkdirSync(dirPath, {recursive: true});
			const fpathFolderized = path.join(dirPath, name);

			// For non-macro documents, just move the JSON
			if (!isMacroKey(json._key)) {
				fs.renameSync(fpath, fpathFolderized);
				return;
			}

			// For macro documents, track the `"command"` source, and write out the modified file
			json.command_source = fpathFolderized.replace(/\.json$/, ".js").split(path.sep).join("/");
			fs.writeFileSync(fpathFolderized, JSON.stringify(json, null, 2) + "\n", "utf-8");
			fs.renameSync(fpath.replace(/\.json$/, ".js"), json.command_source);
			if (dirPathParts.length) fs.unlinkSync(fpath);
		});

	console.groupEnd();
}
