/**
 * A macro to run through all macros in the compendium, testing hit/miss versions where available.
 */
(async () => {
    const tokenSource = canvas.tokens.controlled[0];
    if (!tokenSource) return ui.notifications.warning("Please select a source token first!");

    const tokenTarget = [...game.user.targets][0];
    if (!tokenTarget) return ui.notifications.warning("Please select a target token first!");

    // ---

    const NAMES_BLOCKLIST = new Set([
        "Preload LancerWeaponFX",
    ]);

    const NAMES_NO_MISS = new Set([
        "Apply Smoke Grenade",
        "Deploy Smoke Mine",
        "Flechette Launcher",
        "Flamethrower",
        "LockOn",
        "Plasma Thrower",
        "Plasma Torch",
        "Stabilize",
    ]);

    // ---

    // Patch the API function to allow us to return specific values
    const api = game.modules.get("lancer-weapon-fx").api;
    const fnCache = api.getMacroVariables.bind(api);

    let isMiss = false;
    api.getMacroVariables = () => {
        return {
            sourceToken: tokenSource,
            targetsMissed: isMiss ? new Set([tokenTarget.id]) : new Set(),
            targetTokens: [tokenTarget],
        };
    };

    // ---

    try {
        const pDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        const packMacros = game.packs.get("lancer-weapon-fx.WeaponFX");
        const macros = [...(await packMacros.getDocuments())]
            .sort((a, b) => a.name.localeCompare(b.name, {sensitivity: "base"}));

        for (const macro of macros) {
            if (NAMES_BLOCKLIST.has(macro.name)) continue;

            const missVals = NAMES_NO_MISS.has(macro.name) ? [null] : [true, false];

            for (const _isMiss of missVals) {
                isMiss = _isMiss;

                const macroData = macro.toObject();

                const tempMacro = new Macro(macroData);
                tempMacro.ownership.default = CONST.DOCUMENT_PERMISSION_LEVELS.OWNER;

                const ptMessageMiss = isMiss != null
                    ? ` (${isMiss ? "Miss" : "Hit"})`
                    : "";
                ui.notifications.info(`Playing "${macroData.name}"${ptMessageMiss}`);

                tempMacro.execute(tokenSource, [tokenTarget]);

                await pDelay(3000);

                TokenMagic.deleteFilters(tokenSource);
                TokenMagic.deleteFilters(tokenTarget);
            }
        }
    } finally {
        api.getMacroVariables = fnCache;
    }
})();
