import fs from "fs";
import path from "path";
import { expect, jest, test } from "@jest/globals";
import { weaponEffects } from "../scripts/effectResolver/weaponEffects.js";
import { DIR_PACKS_SOURCE, PACK_ID } from "../tooling/consts.mjs";

const AUTO_EFFECTS_DIR = path.join(DIR_PACKS_SOURCE, PACK_ID, "Effects");

const automaticMacros = fs
    .readdirSync(AUTO_EFFECTS_DIR)
    .filter(filename => filename.endsWith(".json"))
    .map(filename => JSON.parse(fs.readFileSync(path.join(AUTO_EFFECTS_DIR, filename), "utf-8")).name);

test(`that all macros linked in "weaponEffects" exist`, () => {
    const automaticMacrosSet = new Set(automaticMacros);
    const missingNames = Object.values(weaponEffects).filter(name => !automaticMacrosSet.has(name));
    expect(missingNames).toStrictEqual([]);
});

test(`that effects not listed in "weaponEffects" are not in the "Effects" folder`, () => {
    const weaponEffectsSet = new Set(Object.values(weaponEffects));
    const manualNames = automaticMacros.filter(name => !weaponEffectsSet.has(name));
    expect(manualNames).toStrictEqual([]);
});
