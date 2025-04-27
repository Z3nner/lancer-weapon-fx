const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "jb2a.melee_generic.slash.01.orange",
    "modules/lancer-weapon-fx/soundfx/bladeswing.ogg",
    "modules/lancer-weapon-fx/soundfx/bladehit.ogg",
    "jb2a.static_electricity.03.blue",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    const targetHeightOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, missed: targetsMissed.has(target.id) });
    const targetHeightOffsetRand = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, randomOffset: 0.4, missed: targetsMissed.has(target.id) });

    // SLASH
    sequence
        .canvasPan()
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 300,
                fadeOutDuration: 50,
                fadeInDuration: 150,
                strength: 8,
                frequency: 25,
                rotation: false,
            }),
        )
        .delay(600)
        .effect()
            .file("jb2a.melee_generic.slash.01.orange")
            .atLocation(sourceToken, heightOffset)
            .spriteOffset({ x: -0.2 }, { gridUnits: true })
            .stretchTo(target, targetHeightOffset)
            .delay(500)
            .aboveInterface()
            .xray()
            .missed(targetsMissed.has(target.id))
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/bladeswing.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
            .delay(500)
            .waitUntilFinished(-1300);
    // IMPACT
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/bladehit.ogg")
            .playIf(!targetsMissed.has(target.id))
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
        .canvasPan()
            .playIf(!targetsMissed.has(target.id))
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 500,
                fadeOutDuration: 300,
                strength: 14,
                frequency: 25,
                rotation: false,
            }),
        )
        .effect()
            .file("jb2a.static_electricity.03.blue")
            .playIf(!targetsMissed.has(target.id))
            .scaleToObject(0.5)
            .atLocation(target, targetHeightOffsetRand)
            .spriteRotation(45)
            .spriteScale({ x: 0.8164965809277259, y: 1.414213562373095 })
            .repeats(2, 80)
            .aboveInterface()
            .xray()
            .mask(target)
            .waitUntilFinished(-2200);
}
sequence.play();
