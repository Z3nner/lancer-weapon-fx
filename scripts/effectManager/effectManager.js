import { MODULE_ID } from "../consts.js";
import { EffectManagerApp } from "./app.js";
import { SETTING_EFFECTS_MANAGER_STATE } from "../settings.js";
import { TOUR_ID } from "./consts.js";
import { EffectManagerData } from "./models.js";

export const bindHooks = () => {
    Hooks.once("init", () => {
        // Add the button to the module settings
        game.settings.registerMenu(MODULE_ID, "effectsManagerMenu", {
            name: "lancer-weapon-fx.effectManager.settings.Effects Manager",
            label: "lancer-weapon-fx.effectManager.settings.Open Effects Manager",
            icon: "fas fa-explosion",
            type: EffectManagerApp,
            restricted: true, // GM only, as we modify a game setting
        });

        game.settings.register(MODULE_ID, SETTING_EFFECTS_MANAGER_STATE, {
            name: "Effects Manager State",
            scope: "world",
            config: false,
            type: Object,
            default: new EffectManagerData().toObject(),
            onChange: state => {
                EffectManagerApp.onStateChange({ state });
            },
        });

        // Register Handlebars partials
        loadTemplates({
            [`${MODULE_ID}.effect-manager-effect-row`]: `modules/${MODULE_ID}/templates/effectManager/partial/effect-row.hbs`,
            [`${MODULE_ID}.effect-manager-folder-row`]: `modules/${MODULE_ID}/templates/effectManager/partial/folder-row.hbs`,
        }).then(null);

        // Register Tour
        Tour.fromJSON(`modules/${MODULE_ID}/tours/effect-manager.json`).then(tour =>
            game.tours.register(MODULE_ID, TOUR_ID, tour),
        );

        // Show the tour when opening the manager for the first time
        Hooks.on("renderEffectManagerApp", async () => {
            const tour = game.tours.get(`${MODULE_ID}.${TOUR_ID}`);
            if (tour?.status !== Tour.STATUS.UNSTARTED) return;

            await tour.start();

            // Force the tour to re-render its starting step. This prevents it from disappearing when:
            //   - We click the settings button to open the app
            //   - The app opens, triggering a "pointerleave" event on the button, as the app now occludes the button
            //   - The tooltip manager queues up a "deactivate tooltip" task, on a timer
            //   - Our app finishes rendering; our hook here triggers, the tour start
            //   - The tooltip manager's timer pops, and it deactivates our tour's tooltip.
            setTimeout(() => {
                tour.progress(0);
            }, 50);
        });
    });
};
