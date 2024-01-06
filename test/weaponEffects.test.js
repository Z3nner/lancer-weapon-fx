import fs from "fs";
import path from "path";
import {weaponEffects} from "../scripts/weaponEffects.js";
import {DIR_PACKS_SOURCE} from "../tooling/consts.mjs";

const WEAPON_FX_PACK_DIR = path.join(DIR_PACKS_SOURCE, "weaponfx.db");

const automaticMacros = fs.readdirSync(WEAPON_FX_PACK_DIR)
    .filter(filename => filename.endsWith(".json"))
    .map(filename => JSON.parse(fs.readFileSync(path.join(WEAPON_FX_PACK_DIR, filename), "utf-8")).name);

test(
    `that all macros lined in "weaponEffects" exist`,
    () => {
        const automaticMacrosSet = new Set(automaticMacros);
        const missingNames = Object.values(weaponEffects)
            .filter(name => !automaticMacrosSet.has(name));
        expect(missingNames).toStrictEqual([]);
    },
);

test(
    `that effects not listed in "weaponEffects" are not in the "weaponfx" compendium`,
    () => {
        const weaponEffectsSet = new Set(Object.values(weaponEffects));
        const manualNames = automaticMacros
            .filter(name => !weaponEffectsSet.has(name));
        expect(manualNames).toStrictEqual([]);
    },
);
