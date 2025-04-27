const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/DD288Full.ogg",
    "jb2a.unarmed_strike.physical.01.blue",
    "jb2a.explosion_side.01.orange",
    "jb2a.explosion.side_fracture.flask.01",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    const targetHeightOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, missed: targetsMissed.has(target.id) });

    // SWING
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/DD288Full.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.6))
            .waitUntilFinished(-3400);
    sequence
        .canvasPan()
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 450,
                fadeOutDuration: 100,
                fadeInDuration: 300,
                strength: 10,
                frequency: 18,
                rotation: false,
            }),
        )
        .canvasPan()
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 500,
                fadeOutDuration: 50,
                fadeInDuration: 400,
                strength: 20,
                frequency: 25,
                rotation: false,
            }),
        )
        .delay(500);
    sequence
        .effect()
            .file("jb2a.unarmed_strike.physical.01.blue")
            .filter("ColorMatrix", { hue: 000, brightness: 0.5 })
            .filter("Glow", { distance: 3, color: 0xe99649, innerStrength: 2 })
            .atLocation(sourceToken, heightOffset)
            .playbackRate(0.7)
            .scale(8)
            .stretchTo(target, targetHeightOffset)
            .missed(targetsMissed.has(target.id))
            .aboveInterface()
            .xray()
            .name("impact")
            .waitUntilFinished(-650);
    // IMPACT
    sequence
        .canvasPan()
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 500,
                fadeOutDuration: 200,
                fadeInDuration: 50,
                strength: 35,
                frequency: 25,
                rotation: false,
            }),
        )
        .canvasPan()
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 500,
                fadeOutDuration: 500,
                strength: 25,
                frequency: 25,
                rotation: false,
            }),
        )
        .delay(300)
        .effect()
            .file("jb2a.explosion.side_fracture.flask.01")
            .playIf(!targetsMissed.has(target.id))
            .scaleToObject(3)
            .atLocation(target, targetHeightOffset)
            .belowTokens()
            .xray()
            .rotateTowards(sourceToken)
            .rotate(180)
            .playbackRate(0.5)
        .effect()
            .file("jb2a.explosion_side.01.orange")
            .scaleToObject(6)
            .atLocation(target, targetHeightOffset)
            .rotateTowards(sourceToken)
            .aboveInterface()
            .xray()
            .rotate(180)
            .spriteOffset({ x: -2.9 }, { gridUnits: true })
            .zIndex(1);
}
sequence.play();
