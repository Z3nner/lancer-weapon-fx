const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients(["modules/lancer-weapon-fx/soundfx/shotgun_fire.ogg", "jb2a.bolt.physical.orange", "jb2a.explosion.01.orange", "modules/lancer-weapon-fx/soundfx/Missile_Impact.ogg"])

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/shotgun_fire.ogg")
        .delay(200)
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence.effect()
        .file("jb2a.bolt.physical.orange")
        .atLocation(sourceToken)
        .startTime(500)
        .stretchTo(target)
        .missed(targetsMissed.has(target.id))
        .name("bolt")
        .waitUntilFinished(-400)
    .effect()
        .file("jb2a.explosion.01.orange")
        .atLocation("bolt");

    if (!targetsMissed.has(target.id)) {
        sequence.sound()
            .file("modules/lancer-weapon-fx/soundfx/Missile_Impact.ogg")
            .delay(50)
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    }
}
sequence.play();