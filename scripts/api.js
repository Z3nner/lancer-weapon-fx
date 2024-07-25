import { euclideanDistance, getMacroVariables } from "./utils.js";
import LloydsAlgorithm from "./lloydsAlgorithm.js";
import { SETTING_VOLUME } from "./settings.js";
import { MODULE_ID } from "./consts.js";

/**
 * Functions exposed by the module for use in macros.
 */
class ModuleApi {
    static getEffectVolume(volume) {
        return volume * game.settings.get(MODULE_ID, SETTING_VOLUME);
    }

    static getTargetLocationsFromTokenGroup(targetTokens, numGroups) {
        const targetPoints = targetTokens.map(token => {
            return { x: token.center.x, y: token.center.y };
        });

        return LloydsAlgorithm.getCentroids(targetPoints, numGroups);
    }

    static getMacroVariables = getMacroVariables;
    static euclideanDistance = euclideanDistance;
}

export const bindHooks = () => {
    Hooks.on("init", () => (game.modules.get(MODULE_ID).api = ModuleApi));
};
