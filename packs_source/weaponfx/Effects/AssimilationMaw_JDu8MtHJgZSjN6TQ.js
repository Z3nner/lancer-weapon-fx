const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/Melee.ogg",
    "jb2a.bite.400px.red",
    "modules/lancer-weapon-fx/soundfx/HeavyImpact.ogg",
    "jb2a.divine_smite.caster.blueyellow",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    const targetHeightOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, missed: targetsMissed.has(target.id) });

    // BITE
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Melee.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .canvasPan()
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 500,
                fadeOutDuration: 300,
                fadeInDurationL: 100,
                strength: 10,
                frequency: 25,
                rotation: false,
            }),
        )
        .effect()
            .file("jb2a.bite.400px.red")
            .atLocation(target, targetHeightOffset)
            .filter("ColorMatrix", { hue: 270 })
            .filter("Glow", { color: 0x8a0303, distance: 2, innerStrength: 2 })
            .zIndex(1)
            .opacity(0.7)
            .scaleToObject(3)
            .isometric({ overlay: true })
            .xray()
            .aboveInterface()
            .waitUntilFinished(targetsMissed.has(target.id) ? 0 : -1000);
    // IMPACT
    sequence
        .canvasPan()
            .playIf(!targetsMissed.has(target.id))
            .shake({
            duration: 500,
            fadeOutDuration: 300,
            fadeInDurationL: 100,
            strength: 25,
            frequency: 25,
            rotation: false,
        })
        .delay(300)
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/HeavyImpact.ogg")
            .playIf(!targetsMissed.has(target.id))
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .effect()
            .file("jb2a.divine_smite.caster.blueyellow")
            .playIf(!targetsMissed.has(target.id))
            .playbackRate(2.2)
            .scaleToObject(1.7)
            .isometric({ overlay: true })
            .filter("Glow", { color: 0x8a0303, distance: 2, innerStrength: 2 })
            .filter("ColorMatrix", { hue: 300 })
            .atLocation(target, targetHeightOffset)
            .xray()
            .aboveInterface()
            .waitUntilFinished(-1000);
}
sequence.play();
