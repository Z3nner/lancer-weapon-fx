import { weaponEffects } from "./weaponEffects.js";
import { MODULE_ID, PACK_ID_WEAPONFX } from "../consts.js";
import { SETTING_EFFECTS_MANAGER_STATE } from "../settings.js";
import { getSearchString } from "../utils.js";

/* -------------------------------------------- */

const _getCustomMacroUuid_itemLid = ({ itemLid, customEffects }) => {
    const itemLidSearch = getSearchString(itemLid);
    if (!itemLidSearch) return null;

    const byLid = Object.values(customEffects)
        // `.filter` instead of `.find` so we can warn if multiple matches
        .filter(effect => getSearchString(effect.itemLid) === itemLid && getSearchString(effect.macroUuid));

    if (!byLid.length) return null;

    const [{ macroUuid }] = byLid;
    if (byLid.length === 1) return macroUuid;

    ui.notifications.warn(`Multiple custom effects found for Lancer ID "${itemLid}"!`);

    return macroUuid;
};

const _getCustomMacroUuid_itemName = ({ itemName, customEffects }) => {
    const itemNameSearch = getSearchString(itemName);
    if (!itemNameSearch) return null;

    const byName = Object.values(customEffects)
        // `.filter` instead of `.find` so we can warn if multiple matches
        .filter(effect => getSearchString(effect.itemName) === itemNameSearch && getSearchString(effect.macroUuid));

    if (!byName.length) return null;

    const [{ macroUuid }] = byName;
    if (byName.length === 1) return macroUuid;

    ui.notifications.warn(`Multiple custom effects found for Item Name "${itemName}"!`);

    return macroUuid;
};

const _getCustomMacroUuid = (itemLid, itemName) => {
    const customEffects = (game.settings.get(MODULE_ID, SETTING_EFFECTS_MANAGER_STATE) || {}).effects;
    if (!customEffects || !Object.keys(customEffects).length) return null;

    const byLid = _getCustomMacroUuid_itemLid({ itemLid, customEffects });
    if (byLid) return byLid;

    const byName = _getCustomMacroUuid_itemName({ itemName, customEffects });
    if (byName) return byName;

    return null;
};

/* -------------------------------------------- */

const _pGetLwfxMacroUuid = async macroName => {
    if (!macroName) return null;

    const pack = game.packs.get(PACK_ID_WEAPONFX);
    if (!pack) {
        ui.notifications.error(`Lancer Weapon FX | Compendium ${PACK_ID_WEAPONFX} not found`);
        return null;
    }

    // Case- and whitespace-insensitive search
    const macroSearchName = getSearchString(macroName);
    const macro = (await pack.getDocuments()).find(doc => getSearchString(doc.name) === macroSearchName);

    if (!macro) {
        ui.notifications.error(`Lancer Weapon FX | Macro ${macroName} not found`);
        return null;
    }

    return macro.uuid;
};

/* -------------------------------------------- */

export const pGetMacroUuid = async (itemLid, itemName, fallbackActionIdentifier) => {
    // Resolve custom macros first, to allow the user to override the module defaults
    const customUuid = await _getCustomMacroUuid(itemLid, itemName);
    if (customUuid) {
        console.log(
            `Lancer Weapon FX | Found custom macro "${customUuid}" for Lancer ID "${itemLid}"/Item Name "${itemName}"`,
        );
        return customUuid;
    }

    const lwfxUuid = await _pGetLwfxMacroUuid(weaponEffects[itemLid]);
    if (lwfxUuid) {
        console.log(`Lancer Weapon FX | Found macro "${lwfxUuid}" for Lancer ID "${itemLid}"`);
        return lwfxUuid;
    }

    const lwfxFallbackUuid = await _pGetLwfxMacroUuid(weaponEffects[fallbackActionIdentifier]);
    if (lwfxFallbackUuid) {
        console.log(
            `Lancer Weapon FX | Found macro "${lwfxFallbackUuid}" for fallback identifier "${fallbackActionIdentifier}"`,
        );
        return lwfxFallbackUuid;
    }

    console.log(
        `Lancer Weapon FX | Did not find macro for identifier "${itemLid}" with fallback "${fallbackActionIdentifier}"`,
    );

    return null;
};
