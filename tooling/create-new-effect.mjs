import fs from "fs";
import path from "path";
import { Command, Option } from "commander";
import { getFoundryId, getSafeFilename, isValidFoundryImage } from "./utils.js";
import { DIR_PACKS_SOURCE, PACK_ID } from "./consts.mjs";
import { getMacroKey } from "./utils-pack.js";

const _TYPE_INFO = {
    "effect": {
        folderJson: JSON.parse(
            fs.readFileSync(path.join(DIR_PACKS_SOURCE, PACK_ID, "Effects_Qf6H7pepYZi6Oa6S.json"), "utf-8"),
        ),
    },
    "manual": {
        folderJson: JSON.parse(
            fs.readFileSync(path.join(DIR_PACKS_SOURCE, PACK_ID, "Effects__Manual__o8nGPmux6bWEpn9M.json"), "utf-8"),
        ),
    },
};

const program = new Command();

program.name("create-new-effect").description("CLI for creating a new weapon FX macro").version("2.0.0");

program
    .argument("<name>", "macro name")
    .option("--id <id>", "16-character alphanumeric ID", getFoundryId())
    .option("--img <img>", "path to icon image", "icons/svg/dice-target.svg")
    .addOption(new Option("--type <type>").choices(Object.keys(_TYPE_INFO)).default("effect"))
    .action((name, { id, img, type }) => {
        if (!name.trim()) program.error(`<name> must be 1 or more (non-whitespace) characters!`);
        if (id.length !== 16) program.error(`<id> must be 16 characters!`);
        if (!img.trim()) program.error(`<img> must be 1 or more (non-whitespace) characters!`);
        if (!isValidFoundryImage(img)) program.error(`<img> must have an image file extension!`);

        const filenameOut = getSafeFilename(`${name}_${id}`);
        const {
            folderJson: { _id: folderId, name: dirName },
        } = _TYPE_INFO[type];

        const effectTemplateJs = fs.readFileSync(path.join("tooling", "effect.template.js"));
        const effectJson = JSON.stringify(
            {
                "_id": id,
                "name": name,
                "type": "script",
                "img": img,
                "scope": "global",
                "folder": folderId,
                "_key": getMacroKey(id),
                "command_source": `packs_source/${PACK_ID}/${dirName}/${filenameOut}.js`,
            },
            null,
            4,
        );

        const dirOut = path.join(DIR_PACKS_SOURCE, PACK_ID, dirName);

        const fpathOutJs = path.join(dirOut, `${filenameOut}.js`);
        const fpathOutJson = path.join(dirOut, `${filenameOut}.json`);

        fs.writeFileSync(fpathOutJs, effectTemplateJs);
        fs.writeFileSync(fpathOutJson, effectJson);

        console.log(`Created "${fpathOutJs}" and "${fpathOutJson}":`);
        console.log(effectJson);
        console.warn(`\nNext steps:
• Complete the macro JS
• Edit the "img" in the macro JSON
• Run "npm run db:pack"
• Test in-game!${type === "effect" ? `\n• (Add to "scripts/effectResolver/weaponEffects.js")` : ""}`);
    });

program.parse();
