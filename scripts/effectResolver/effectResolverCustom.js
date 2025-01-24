import { getSearchString } from "../utils.js";
import { MODULE_ID } from "../consts.js";
import { SETTING_EFFECTS_MANAGER_STATE } from "../settings.js";

const _TYPE_STRONG = "strong";
const _TYPE_WEAK = "weak";
const _TYPE_NONE = "none";

// Prefer effects with folders, as we want effects with actors (which are stored at the folder level)
//   to take precedent over generic effects.
const _sortCustomEffects = (effectA, effectB) => Number(!!effectB.folderId) - Number(!!effectA.folderId);

const _getEffectActorUuidMatchType = ({ actorUuid, effect, customState }) => {
    if (actorUuid == null || effect.folderId == null) return _TYPE_WEAK;

    const effectActorUuid = customState.folders[effect.folderId]?.actorUuid;
    if (effectActorUuid == null) return _TYPE_WEAK;

    if (effectActorUuid === actorUuid) return _TYPE_STRONG;

    return _TYPE_NONE;
};

const _getActorSpecificCandidateEffects = ({ actorUuid, customState, candidateEffects }) => {
    const typed = {};

    candidateEffects.forEach(effect => {
        (typed[_getEffectActorUuidMatchType({ actorUuid, effect, customState })] ||= []).push(effect);
    });

    if (typed[_TYPE_STRONG]?.length) return typed[_TYPE_STRONG];
    if (typed[_TYPE_WEAK]?.length) return typed[_TYPE_WEAK];
    return [];
};

const _getCustomMacroUuidByItemLid = ({ actorUuid, itemLid, customState }) => {
    const itemLidSearch = getSearchString(itemLid);
    if (!itemLidSearch) return null;

    const candidateEffects = Object.values(customState.effects)
        .sort(_sortCustomEffects)
        // `.filter` instead of `.find` so we can warn if multiple matches
        .filter(effect => getSearchString(effect.itemLid) === itemLidSearch && getSearchString(effect.macroUuid));

    const byLid = _getActorSpecificCandidateEffects({
        actorUuid,
        customState,
        candidateEffects,
    });

    if (!byLid.length) return null;

    const [{ macroUuid }] = byLid;
    if (byLid.length === 1) return macroUuid;

    ui.notifications.warn(`Multiple custom effects found for Lancer ID "${itemLid}"!`);

    return macroUuid;
};

const _getCustomMacroUuidByItemName = ({ actorUuid, itemName, customState }) => {
    const itemNameSearch = getSearchString(itemName);
    if (!itemNameSearch) return null;

    const candidateEffects = Object.values(customState.effects)
        .sort(_sortCustomEffects)
        // `.filter` instead of `.find` so we can warn if multiple matches
        .filter(effect => getSearchString(effect.itemName) === itemNameSearch && getSearchString(effect.macroUuid));

    const byName = _getActorSpecificCandidateEffects({
        actorUuid,
        customState,
        candidateEffects,
    });

    if (!byName.length) return null;

    const [{ macroUuid }] = byName;
    if (byName.length === 1) return macroUuid;

    ui.notifications.warn(`Multiple custom effects found for Item Name "${itemName}"!`);

    return macroUuid;
};

export const getCustomMacroUuid = ({ actorUuid, itemLid, itemName = null }) => {
    const customState = game.settings.get(MODULE_ID, SETTING_EFFECTS_MANAGER_STATE);
    if (!Object.keys(customState?.effects || {}).length) return null;

    // Resolve by name first. This allows the name of a renamed item to take precedence over its user-invisible LID.
    const byName = _getCustomMacroUuidByItemName({ actorUuid, itemName, customState });
    if (byName) return byName;

    const byLid = _getCustomMacroUuidByItemLid({ actorUuid, itemLid, customState });
    if (byLid) return byLid;

    return null;
};
