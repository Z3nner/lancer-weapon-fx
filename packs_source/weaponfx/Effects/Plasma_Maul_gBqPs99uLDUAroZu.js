const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "jb2a.melee_attack.03.trail.maul.01",
    "modules/lancer-weapon-fx/soundfx/Axe_swing.ogg",
    "modules/lancer-weapon-fx/soundfx/HammerImpact.ogg",
    "jb2a.impact.ground_crack.orange.01",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    const targetMoveTowards = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, missed: targetsMissed.has(target.id), moveTowards: true });
    const targetHeightOffsetFloor = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({
            targetToken: target,
            missed: targetsMissed.has(target.id),
            tokenHeightPercent: 0.0,
        });

    sequence
        .effect()
            .file("jb2a.melee_attack.03.trail.04.blue")
            .filter("Glow", {
            color: 0x18f014,
            innerStrength: 1.5,
            knockout: false,
            quality: 0.1,
            distance: 50,
        })
        .tint("#18f014")
        .atLocation(sourceToken, heightOffset)
        .spriteOffset({ x: -0.3 }, { gridUnits: true })
        .aboveInterface()
        .xray()
        .moveTowards(targetMoveTowards)
        .missed(targetsMissed.has(target.id))
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
                .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.9));
        sequence
            .effect()
                .file("jb2a.impact.ground_crack.orange.01")
                .tint("#18f014")
                .atLocation(target, targetHeightOffsetFloor)
                .belowTokens()
                .xray()
                .scaleToObject(3)
                .waitUntilFinished(-4000);
    }
}
sequence.play();
