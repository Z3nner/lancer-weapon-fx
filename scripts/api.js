import {getMessageInfo} from "./messageParser.js";
import {euclideanDistance} from "./utils.js";
import LloydsAlgorithm from "./lloydsAlgorithm.js";

/**
 * Functions exposed by the module for use in macros.
 */
class ModuleApi {
    static getEffectVolume(volume) {
        return volume * game.settings.get("lancer-weapon-fx", "volume");
    }

    static getMacroVariables(messageId, actor) {
        const message = game.messages.get(messageId);
        const sourceTokenFallback = canvas.tokens.controlled[0] ?? game.combat?.current?.tokenId;
        const targetsFallback = [...game.user.targets];

        if (!message) {
            return {
                sourceToken: sourceTokenFallback,
                targetTokens: targetsFallback,
                targetsMissed: game.settings.get("lancer-weapon-fx", "debug-is-default-miss")
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

Hooks.on("init", () => game.modules.get("lancer-weapon-fx").api = ModuleApi);
