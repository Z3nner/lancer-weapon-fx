const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/WeaponBeep.ogg",
    "modules/lancer-weapon-fx/soundfx/Thermal_Rifle_Fire.ogg",
    "jb2a.fireball.beam.orange",
    "modules/lancer-weapon-fx/soundfx/Thermal_Rifle_Hit.ogg",
    "jb2a.impact.orange.0",
]);

let sequence = new Sequence();

const tokenHeight = sourceToken.verticalHeight;

for (const target of targetTokens) {
    const targetTokenHeight = target.verticalHeight;

    const targetHeightOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, sprayOffset: true, missed: targetsMissed.has(target.id) });

    const impactScale = (tokenHeight + targetTokenHeight) / 4;

    // SHOT
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/WeaponBeep.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Thermal_Rifle_Fire.ogg")
            .delay(400)
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .effect()
            .file("jb2a.fireball.beam.orange")
            .scale(1.25)
            .startTime(1500)
            .atLocation(sourceToken, heightOffset)
            .stretchTo(target, targetHeightOffset)
            .missed(targetsMissed.has(target.id))
            .xray()
            .aboveInterface()
        .canvasPan()
            .playIf(!targetsMissed.has(target.id))
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 700,
                fadeInDuration: 500,
                strength: 6,
                frequency: 15,
                rotation: false,
            }),
        );

    // IMPACT
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Thermal_Rifle_Hit.ogg")
            .playIf(!targetsMissed.has(target.id))
            .delay(700)
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .effect()
            .file("jb2a.impact.orange.0")
            .playIf(!targetsMissed.has(target.id))
            .atLocation(target, targetHeightOffset)
            .rotateTowards(sourceToken)
            .rotate(230)
            .center()
            .scale(impactScale)
            .xray()
            .aboveInterface()
            .delay(700)
            .waitUntilFinished(-833)
        .canvasPan()
            .playIf(!targetsMissed.has(target.id))
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 700,
                fadeOutDuration: 500,
                strength: 8,
                frequency: 25,
                rotation: false,
            }),
        );
}
sequence.play();
