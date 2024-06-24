const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/WeaponBeep.ogg",
    "modules/lancer-weapon-fx/soundfx/Thermal_Rifle_Fire.ogg",
    "jb2a.fireball.beam.orange",
    "modules/lancer-weapon-fx/soundfx/Thermal_Rifle_Hit.ogg",
    "jb2a.impact.orange.0",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/WeaponBeep.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Thermal_Rifle_Fire.ogg")
        .delay(400)
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence
    .effect()
        .file("jb2a.fireball.beam.orange")
        .scale(1.25)
        .startTime(1500)
        .atLocation(sourceToken)
        .stretchTo(target)
        .missed(targetsMissed.has(target.id))
        .name("impact");

    sequence
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Thermal_Rifle_Hit.ogg")
        .playIf(!targetsMissed.has(target.id))
        .delay(700)
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence
    .effect()
        .file("jb2a.impact.orange.0")
        .playIf(!targetsMissed.has(target.id))
        .atLocation("impact")
        .rotateTowards(sourceToken)
        .rotate(230)
        .center()
        .scaleToObject(1.5)
        .delay(700)
        .waitUntilFinished();
}
sequence.play();
