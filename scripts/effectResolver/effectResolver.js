import { weaponEffects } from "../weaponEffects.js";
import { PACK_ID_WEAPONFX } from "../consts.js";
import { getSearchString } from "../utils.js";
import { getCustomMacroUuid } from "./effectResolverCustom.js";

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

export const pGetMacroUuid = async ({ actorUuid, itemLid, itemName, fallbackActionIdentifier }) => {
    // Resolve custom macros first, to allow the user to override the module defaults
    const customUuid = await getCustomMacroUuid({ actorUuid, itemLid, itemName });
    if (customUuid) {
        console.log(
            `Lancer Weapon FX | Found custom macro "${customUuid}" for Lancer ID "${itemLid}"/Item Name "${itemName}"`,
        );
        return customUuid;
    }

    // Resolve specific effects defined by the module
    const lwfxUuid = await _pGetLwfxMacroUuid(weaponEffects[itemLid]);
    if (lwfxUuid) {
        console.log(`Lancer Weapon FX | Found macro "${lwfxUuid}" for Lancer ID "${itemLid}"`);
        return lwfxUuid;
    }

    // Resolve custom macros bound on fallback "fake LID"s
    const customFallbackUuid = await getCustomMacroUuid({ actorUuid, itemLid: fallbackActionIdentifier });
    if (customFallbackUuid) {
        console.log(
            `Lancer Weapon FX | Found custom macro "${customFallbackUuid}" for fallback identifier "${fallbackActionIdentifier}"`,
        );
        return customFallbackUuid;
    }

    // Resolve fallback effects defined by the module
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
