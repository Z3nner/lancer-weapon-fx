/**
 * A macro to run through all macros in the compendium.
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

    // ---

    const pDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const packMacros = game.packs.get("lancer-weapon-fx.WeaponFX");
    const macros = [...(await packMacros.getDocuments())]
        .sort((a, b) => a.name.localeCompare(b.name, {sensitivity: "base"}));

    for (const macro of macros) {
        if (NAMES_BLOCKLIST.has(macro.name)) continue;

			const macroData = macro.toObject();

			const tempMacro = new Macro(macroData);
			tempMacro.ownership.default = CONST.DOCUMENT_PERMISSION_LEVELS.OWNER;

			ui.notifications.info(`Playing "${macroData.name}"`);

			tempMacro.execute(tokenSource, [tokenTarget]);

			await pDelay(3000);

			TokenMagic.deleteFilters(tokenSource);
			TokenMagic.deleteFilters(tokenTarget);
    }
})();
