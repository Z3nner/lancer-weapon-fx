import fs from "fs";
import path from "path";
import {Command} from "commander";
import sanitize from "sanitize-filename";
import {getFoundryId, isValidFoundryImage} from "./utils.js";
import {DIR_PACKS_SOURCE, MACRO_AUTHOR} from "./consts.mjs";

const program = new Command();

program
	.name("create-new-effect")
	.description("CLI for creating a new weapon FX macro")
	.version("1.0.0");

program
	.argument("<name>", "macro name")
	.option("--id <id>", "16-character alphanumeric ID", getFoundryId())
	.option("--img <img>", "path to icon image", "icons/svg/dice-target.svg")
	.option("--pack <packName>", "pack to add the macro to", "weaponfx")
	.action((name, {id, img, pack}) => {
		if (!name.trim()) program.error(`<name> must be 1 or more (non-whitespace) characters!`);
		if (id.length !== 16) program.error(`<id> must be 16 characters!`);
		if (!img.trim()) program.error(`<img> must be 1 or more (non-whitespace) characters!`);
		if (!isValidFoundryImage(img)) program.error(`<img> must have an image file extension!`);

		const effectTemplateJs = fs.readFileSync(path.join("tooling", "effect.template.js"));
		const effectJson = JSON.stringify(
			{
				"_id": id,
				"name": name,
				"img": img,
				"type": "script",
				"scope": "global",

				// Other required fields (see: `foundry.documents.BaseMacro`)
				"author": MACRO_AUTHOR,
			},
			null,
			4,
		);

		const dirOut = path.join(DIR_PACKS_SOURCE, `${pack}.db`);

		const fnameOut = `${sanitize(name)}.${id}`;
		const fpathOutJs = path.join(dirOut, `${fnameOut}.js`);
		const fpathOutJson = path.join(dirOut, `${fnameOut}.json`);

		fs.writeFileSync(fpathOutJs, effectTemplateJs);
		fs.writeFileSync(fpathOutJson, effectJson);

		console.log(`Created "${fpathOutJs}" and "${fpathOutJson}":`);
		console.log(effectJson);
		console.warn(`\nNext steps:
• Complete the macro JS
• Edit the "img" in the macro JSON
• Run "npm run db:pack"
• Test in-game!${pack === "weaponfx" ? `\n• (Add to "scripts/weaponEffects")` : ""}`);
	});

program.parse();
