const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "jb2a.melee_attack.03.maul.01",
    "modules/lancer-weapon-fx/soundfx/Axe_swing.ogg",
    "modules/lancer-weapon-fx/soundfx/HammerImpact.ogg",
    "jb2a.impact.ground_crack.orange.01",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    const targetHeightOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, missed: targetsMissed.has(target.id) });

    sequence
        .effect()
            .file("jb2a.melee_attack.03.maul.01")
            .atLocation(sourceToken, heightOffset)
            .spriteOffset({ x: -0.3 }, { gridUnits: true })
            .moveTowards(target)
            .missed(targetsMissed.has(target.id))
            .aboveInterface()
            .xray()
            .waitUntilFinished(-1100);
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Axe_swing.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
            .waitUntilFinished(-1800);
    if (!targetsMissed.has(target.id)) {
        sequence
            .sound()
                .file("modules/lancer-weapon-fx/soundfx/HammerImpact.ogg")
                .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(1));
        sequence
            .effect()
                .file("jb2a.impact.ground_crack.orange.01")
                .atLocation(target)
                .belowTokens()
                .xray()
                .scaleToObject(3)
                .waitUntilFinished(-6000)
            .effect()
                .file("jb2a.impact.007.orange")
                .atLocation(target, targetHeightOffset)
                .opacity(0.5)
                .aboveInterface()
                .xray()
                .scaleToObject(3)
                .playbackRate(0.7)
                .waitUntilFinished(-6000);
    }
}
sequence.play();
