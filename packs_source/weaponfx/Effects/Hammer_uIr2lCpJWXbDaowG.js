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
    const targetHeightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: target });
    const targetMoveTowards = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, useAbsoluteCoords: true });

    sequence
        .canvasPan() // windup shake
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 500,
                fadeOutDuration: 150,
                fadeInDuration: 250,
                strength: 8,
                frequency: 25,
                rotation: false,
            }),
        );
    sequence
        .effect()
            .file("jb2a.melee_attack.03.maul.01")
            .atLocation(sourceToken, heightOffset)
            .spriteOffset({ x: -0.3 }, { gridUnits: true })
            .scaleToObject(4.5)
            .moveTowards(targetMoveTowards)
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
                .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.9));
        sequence
            .canvasPan() // IMPACT SHAKE
                .shake(
                game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                    duration: 300,
                    strength: 40,
                    frequency: 15,
                    rotation: false,
                }),
            );
        sequence
            .effect()
                .file("jb2a.impact.ground_crack.orange.01")
                .atLocation(target)
                .belowTokens()
                .xray()
                .scaleToObject(3)
                .randomSpriteRotation()
                .waitUntilFinished(-6000)
            .effect()
                .file("jb2a.impact.007.orange")
                .atLocation(target, targetHeightOffset)
                .opacity(0.8)
                .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
                .aboveInterface()
                .xray()
                .scaleToObject(2.5)
                .playbackRate(0.7)
                .randomSpriteRotation()
                .waitUntilFinished(-6000);
    } else {
        sequence // light swing shake on miss
            .canvasPan()
                .playIf(targetsMissed.has(target.id))
                .shake(
                game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                    duration: 500,
                    fadeInDuration: 500,
                    strength: 8,
                    frequency: 30,
                    rotation: false,
                }),
            );
    }
}
sequence.play();
