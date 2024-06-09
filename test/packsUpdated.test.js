import {expect, jest, test} from '@jest/globals';
import {ClassicLevel} from "classic-level";
import {DIR_PACKS, DIR_PACKS_SOURCE, PACK_ID} from "../tooling/consts.mjs";
import path from "path";
import fs from "fs";

const _getSourceIds = () => {
	return new Set(
		fs.readdirSync(DIR_PACKS_SOURCE, {withFileTypes: true, recursive: true})
			.filter(dirEntry => dirEntry.name.endsWith(".json"))
			.map(dirEntry => {
				const json = JSON.parse(fs.readFileSync(path.join(dirEntry.path, dirEntry.name), "utf-8"));
				return json._id;
			})
			.filter(Boolean),
	);
};

const _pGetDbIds = async () => {
	const db = new ClassicLevel(path.join(DIR_PACKS, PACK_ID), {valueEncoding: "json", keyEncoding: "utf-8"});

	const dbIds = new Set();
	for await (const [key, _] of db.iterator()) {
		const keyIdPart = key.split("!").at(-1);
		dbIds.add(keyIdPart);
	}

	return dbIds;
};

test(
	"that the pack contains exactly the source documents",
	async () => {
		const sourceIds = _getSourceIds();
		const dbIds = await _pGetDbIds();

		expect(sourceIds).toStrictEqual(dbIds);
	},
);
