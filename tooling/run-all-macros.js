/**
 * A macro to run through all macros in the compendium, testing hit/miss versions where available.
 */
(async () => {
    const tokenSource = canvas.tokens.controlled[0];
    if (!tokenSource) return ui.notifications.warn("Please select a source token first!");

    const tokenTargets = [...game.user.targets];
    if (!tokenTargets.length) return ui.notifications.warn("Please select some target tokens first!");

    // ---

    const NAMES_BLOCKLIST = new Set([]);

    const NAMES_NO_MISS = new Set([
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
            targetsMissed: isMiss ? new Set(tokenTargets.map(token => token.id)) : new Set(),
            targetTokens: tokenTargets,
        };
    };

    // ---

    try {
        const pDelay = ms => new Promise(resolve => setTimeout(resolve, ms));

        const packMacros = game.packs.get("lancer-weapon-fx.weaponfx");
        const macros = [...(await packMacros.getDocuments())]
            .filter(macro => macro.folder?.name === "Effects")
            .sort((a, b) => a.name.localeCompare(b.name, { sensitivity: "base" }));

        for (const macro of macros) {
            if (NAMES_BLOCKLIST.has(macro.name)) continue;

            const missVals = NAMES_NO_MISS.has(macro.name) ? [null] : [true, false];

            for (const _isMiss of missVals) {
                isMiss = _isMiss;

                const macroData = macro.toObject();

                const tempMacro = new Macro(macroData);
                tempMacro.ownership.default = CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER;

                const ptMessageMiss = isMiss != null ? ` (${isMiss ? "Miss" : "Hit"})` : "";
                ui.notifications.warn(`Playing "${macroData.name}"${ptMessageMiss}`);

                tempMacro.execute(tokenSource, tokenTargets);

                await pDelay(3000);

                TokenMagic.deleteFilters(tokenSource);
                tokenTargets.forEach(token => TokenMagic.deleteFilters(token));
            }
        }
    } finally {
        api.getMacroVariables = fnCache;
    }
})();
