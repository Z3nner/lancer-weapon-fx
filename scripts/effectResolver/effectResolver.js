import { weaponEffects } from "./weaponEffects.js";
import { MODULE_ID } from "../consts.js";

const _PACK_ID_WEAPONFX = `${MODULE_ID}.weaponfx`;

const _pGetLwfxMacroUuid = async macroName => {
    if (!macroName) return null;

    const pack = game.packs.get(_PACK_ID_WEAPONFX);
    if (!pack) {
        ui.notifications.error(`Lancer Weapon FX | Compendium ${_PACK_ID_WEAPONFX} not found`);
        return null;
    }

    // Case- and whitespace-insensitive search
    const macroSearchName = macroName.toLowerCase().trim();
    const macro = (await pack.getDocuments()).find(doc => doc.name.toLowerCase().trim() === macroSearchName);

    if (!macro) {
        ui.notifications.error(`Lancer Weapon FX | Macro ${macroName} not found`);
        return null;
    }

    return macro.uuid;
};

export const pGetMacroUuid = async (itemLid, fallbackActionIdentifier) => {
    const lwfxUuid = await _pGetLwfxMacroUuid(weaponEffects[itemLid]);
    if (lwfxUuid) {
        console.log(`Lancer Weapon FX | Found macro "${lwfxUuid}" for identifier "${itemLid}"`);
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
