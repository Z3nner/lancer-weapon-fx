import fs from "fs";
import path from "path";
import { expect, jest, test } from "@jest/globals";
import { EFFECTS_WEAR_AND_TEAR, EFFECTS_GEAR } from "../scripts/weaponEffects.js";
import { DIR_PACKS_SOURCE, PACK_ID } from "../tooling/consts.mjs";

const AUTO_EFFECTS_DIR = path.join(DIR_PACKS_SOURCE, PACK_ID, "Effects");

const automaticMacros = fs
    .readdirSync(AUTO_EFFECTS_DIR)
    .filter(filename => filename.endsWith(".json"))
    .map(filename => JSON.parse(fs.readFileSync(path.join(AUTO_EFFECTS_DIR, filename), "utf-8")).name);

test(`that all macros linked in "weaponEffects.js" exist`, () => {
    const automaticMacrosSet = new Set(automaticMacros);
    const missingNames = [...Object.values(EFFECTS_WEAR_AND_TEAR), ...Object.values(EFFECTS_GEAR)].filter(
        name => !automaticMacrosSet.has(name),
    );
    expect(missingNames).toStrictEqual([]);
});

test(`that effects not listed in "weaponEffects.js" are not in the "Effects" folder`, () => {
    const weaponEffectsSet = new Set([...Object.values(EFFECTS_WEAR_AND_TEAR), ...Object.values(EFFECTS_GEAR)]);
    const manualNames = automaticMacros.filter(name => !weaponEffectsSet.has(name));
    expect(manualNames).toStrictEqual([]);
});
