import {getMessageInfo} from "./messageParser.js";
import {euclideanDistance} from "./utils.js";
import LloydsAlgorithm from "./lloydsAlgorithm.js";
import {MODULE_ID, SETTING_DEBUG_IS_DEFAULT_MISS, SETTING_VOLUME} from "./settings.js";

/**
 * Functions exposed by the module for use in macros.
 */
class ModuleApi {
    static getEffectVolume(volume) {
        return volume * game.settings.get(MODULE_ID, SETTING_VOLUME);
    }

    static getMacroVariables(messageId, actor) {
        const message = game.messages.get(messageId);
        const sourceTokenFallback = canvas.tokens.controlled[0] ?? game.combat?.current?.tokenId;
        const targetsFallback = [...game.user.targets];

        if (!message) {
            return {
                sourceToken: sourceTokenFallback,
                targetTokens: targetsFallback,
                targetsMissed: game.settings.get(MODULE_ID, SETTING_DEBUG_IS_DEFAULT_MISS)
                    ? new Set(targetsFallback.map(target => target.id))
                    : new Set(),
            };
        }

        const {sourceToken, targetTokens, targetsMissed} = getMessageInfo(message);
        return {
            sourceToken: sourceToken || sourceTokenFallback,
            targetTokens: targetTokens || targetsFallback,
            targetsMissed,
        };
    }

    static getTargetLocationsFromTokenGroup(targetTokens, numGroups) {
        const targetPoints = targetTokens.map(token => {
            return {x: token.center.x, y: token.center.y};
        });

        return LloydsAlgorithm.getCentroids(targetPoints, numGroups);
    }

    static euclideanDistance = euclideanDistance;
}

export const bindHooks = () => {
    Hooks.on("init", () => game.modules.get(MODULE_ID).api = ModuleApi);
};
