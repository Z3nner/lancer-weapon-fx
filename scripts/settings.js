import { MODULE_ID } from "./consts.js";

export const SETTING_VOLUME = "volume";
export const SETTING_SCREENSHAKE_INTENSITY = "screenshake-intensity";
export const SETTING_IS_PLAY_DEFAULT_EFFECTS_GEAR = "isPlayDefaultEffectsGear";
export const SETTING_IS_PLAY_DEFAULT_EFFECTS_WEAR_AND_TEAR = "isPlayDefaultEffectsWearAndTear";
export const SETTING_IS_WEAPON_HEURISTIC_ACTIVE = "isWeaponHeuristicActive";
export const SETTING_EFFECTS_MANAGER_STATE = "effectsManagerState";

export const SETTING_DEBUG_IS_DEFAULT_MISS = "debug-is-default-miss";

export const bindHooks = () => {
    // Register settings
    Hooks.on("init", () => {
        game.settings.register(MODULE_ID, SETTING_VOLUME, {
            name: "lancer-weapon-fx.Sound Volume",
            hint: "lancer-weapon-fx.Sound Volume Hint",
            scope: "world",
            config: true,
            type: Number,
            range: { min: 0, max: 2, step: 0.1 },
            default: 1.0,
        });

        game.settings.register(MODULE_ID, SETTING_SCREENSHAKE_INTENSITY, {
            name: "lancer-weapon-fx.Screenshake Intensity",
            hint: "lancer-weapon-fx.Screenshake Intensity Hint",
            scope: "world",
            config: true,
            type: Number,
            range: { min: 0, max: 2, step: 0.1 },
            default: 1.0,
        });

        game.settings.register(MODULE_ID, SETTING_IS_PLAY_DEFAULT_EFFECTS_GEAR, {
            name: "lancer-weapon-fx.Play Default Gear Effects",
            hint: "lancer-weapon-fx.Play Default Gear Effects Hint",
            scope: "world",
            config: true,
            type: Boolean,
            default: true,
        });

        game.settings.register(MODULE_ID, SETTING_IS_PLAY_DEFAULT_EFFECTS_WEAR_AND_TEAR, {
            name: "lancer-weapon-fx.Play Default Wear and Tear Effects",
            hint: "lancer-weapon-fx.Play Default Wear and Tear Effects Hint",
            scope: "world",
            config: true,
            type: Boolean,
            default: true,
        });

        game.settings.register(MODULE_ID, SETTING_IS_WEAPON_HEURISTIC_ACTIVE, {
            name: "lancer-weapon-fx.Use Weapon Heuristic",
            hint: "lancer-weapon-fx.Use Weapon Heuristic Hint",
            scope: "world",
            config: true,
            type: Boolean,
            default: true,
        });

        game.settings.register(MODULE_ID, SETTING_DEBUG_IS_DEFAULT_MISS, {
            name: "lancer-weapon-fx.Debug: Play Miss Animations by Default",
            scope: "client",
            config: true,
            type: Boolean,
            default: false,
        });
    });
};
