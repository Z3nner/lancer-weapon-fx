const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const target = targetTokens[0];

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/APR2_Load.ogg",
    "modules/lancer-weapon-fx/soundfx/APR2_Fire.ogg",
    "jb2a.lasershot.green",
    "jb2a.toll_the_dead.green.shockwave",
    "jb2a.smoke.puff.side.02.white",
    "modules/lancer-weapon-fx/soundfx/APR2_Impact.ogg",
]);

let sequence = new Sequence()

    .sound()
        .file("modules/lancer-weapon-fx/soundfx/APR2_Load.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .waitUntilFinished()
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/APR2_Fire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    .effect()
        .file("jb2a.lasershot.green")
        .atLocation(sourceToken)
        .stretchTo(target)
        .missed(targetsMissed.has(target.id))
        .scale(2.0)
        .waitUntilFinished(-400);
if (!targetsMissed.has(target.id)) {
    sequence
        .effect()
            .file("jb2a.toll_the_dead.green.shockwave")
            .atLocation(target)
            .scale(0.7)
            .zIndex(1)
        .effect()
            .file("jb2a.smoke.puff.side.02.white")
            .atLocation(target)
            .rotateTowards(sourceToken)
            .rotate(180)
            .zIndex(1)
            .tint("#43b918")
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/APR2_Impact.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
}

sequence.play();
