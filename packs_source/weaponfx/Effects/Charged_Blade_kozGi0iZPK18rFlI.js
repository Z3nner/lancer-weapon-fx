const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "jb2a.melee_attack.01.magic_sword.yellow",
    "modules/lancer-weapon-fx/soundfx/Axe_swing.ogg",
    "modules/lancer-weapon-fx/soundfx/Melee.ogg",
    "jb2a.impact.blue.3",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    const targetHeightOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, missed: targetsMissed.has(target.id) });

    // SLASH
    sequence
        .canvasPan()
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 500,
                fadeOutDuration: 150,
                fadeInDuration: 250,
                strength: 8,
                frequency: 25,
                rotation: false,
            }),
        )
        .delay(700)
        .effect()
            .file("jb2a.melee_attack.01.magic_sword.yellow")
            .filter("ColorMatrix", { hue: 180 })
            .delay(500)
            .scaleToObject(4.5)
            .atLocation(sourceToken, heightOffset)
            .moveTowards(target)
            .waitUntilFinished(-1000)
            .missed(targetsMissed.has(target.id))
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Axe_swing.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .waitUntilFinished(-1450);
    // IMPACT
    sequence
        .canvasPan()
            .playIf(!targetsMissed.has(target.id))
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 300,
                fadeOutDuration: 200,
                strength: 16,
                frequency: 25,
                rotation: false,
            }),
        )
        .delay(100)
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Melee.ogg")
            .playIf(!targetsMissed.has(target.id))
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
        .effect()
            .file("jb2a.impact.blue.3")
            .playIf(!targetsMissed.has(target.id))
            .scaleToObject(2)
            .atLocation(target, targetHeightOffset)
            .waitUntilFinished(-1200);
}
sequence.play();
