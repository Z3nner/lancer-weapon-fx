import { euclideanDistance, getMacroVariables } from "./utils.js";
import LloydsAlgorithm from "./lloydsAlgorithm.js";
import tokenHeightOffset from "./tokenHeightOffset.js";
import { SETTING_VOLUME, SETTING_SCREENSHAKE, SETTING_SCREENSHAKE_INTENSITY } from "./settings.js";
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

    static getTokenHeightOffset({
        targetToken,
        randomOffset = false,
        sprayOffset = false,
        missed = false,
        useAbsoluteCoords = false,
        tokenHeightPercent = 0.6,
        ignoreElevation = false,
    } = {}) {
        // get the token height offset for the target token
        return tokenHeightOffset.getTokenHeightOffset({
            targetToken: targetToken,
            randomOffset_: randomOffset,
            sprayOffset: sprayOffset,
            missed: missed,
            useAbsoluteCoords: useAbsoluteCoords,
            tokenHeightPercent: tokenHeightPercent,
            ignoreElevation: ignoreElevation,
        });
    }

    static isIsometric() {
        // Check if the current canvas is isometric
        return tokenHeightOffset.isIsometric();
    }

    static isometricEffectFlag() {
        // for manually setting the isometric effect flag
        // on sequencer .isometric() calls
        const isIsometric = tokenHeightOffset.isIsometric();

        if (isIsometric) {
            return {overlay: true};
        }
        return {};
    }

    static calculateScreenshake(shakeObject) {
        // take in the screenshake object and scale strength/frequency values by the screenshake intensity
        // and return the screenshake object
        shakeObject.strength = Math.round(shakeObject.strength * this.getScreenshakeIntensity());
        shakeObject.frequency = Math.round(shakeObject.frequency * this.getScreenshakeIntensity());

        return shakeObject;
    }

    static getScreenshakeEnabled() {
        // Check if screenshake is enabled in the settings or if the intensity is 0
        if (
            !game.settings.get(MODULE_ID, SETTING_SCREENSHAKE) ||
            game.settings.get(MODULE_ID, SETTING_SCREENSHAKE_INTENSITY) === 0
        ) {
            return false;
        } else {
            return true;
        }
    }

    static getScreenshakeIntensity() {
        // If screenshake is enabled, return the intensity value
        // If screenshake is not enabled, return 0
        if (!game.settings.get(MODULE_ID, SETTING_SCREENSHAKE)) {
            return 0;
        }
        return game.settings.get(MODULE_ID, SETTING_SCREENSHAKE_INTENSITY);
    }

    static getMacroVariables = getMacroVariables;
    static euclideanDistance = euclideanDistance;
}

export const bindHooks = () => {
    Hooks.on("init", () => (game.modules.get(MODULE_ID).api = ModuleApi));
};
