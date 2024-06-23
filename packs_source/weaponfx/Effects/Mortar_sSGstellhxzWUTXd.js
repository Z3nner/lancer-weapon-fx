const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const centerMass = game.modules.get("lancer-weapon-fx").api.getTargetLocationsFromTokenGroup(targetTokens, 1)[0];

const repeatImpactAnimationForEachTarget = function (sequence, targetTokens) {
    targetTokens.forEach(t => {
        if (!targetsMissed.has(t.id)) {
            sequence
                .effect()
                .file("jb2a.explosion_side.01.orange")
                .atLocation(t)
                .rotateTowards(centerMass)
                .scale(0.7)
                .center();
        }
    });
    return sequence;
};

await Sequencer.Preloader.preloadForClients([
    "jb2a.explosion_side.01.orange",
    "modules/lancer-weapon-fx/soundfx/Mortar_Launch.ogg",
    "jb2a.smoke.puff.side.02.white",
    "jb2a.bullet.02.orange",
    "jb2a.explosion.shrapnel.bomb.01.black",
    "jb2a.explosion.08.orange",
    "modules/lancer-weapon-fx/soundfx/Mortar_Impact.ogg",
]);

let sequence = new Sequence();

sequence
    .sound()
    .file("modules/lancer-weapon-fx/soundfx/Mortar_Launch.ogg")
    .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
sequence
    .effect()
    .file("jb2a.smoke.puff.side.02.white")
    .atLocation(sourceToken)
    .rotateTowards(centerMass)
    .scale({ y: 0.5 });
sequence
    .effect()
    .file("jb2a.bullet.02.orange")
    .atLocation(sourceToken)
    .stretchTo(centerMass)
    .playbackRate(0.7)
    .waitUntilFinished(-650);

sequence.effect().file("jb2a.explosion.shrapnel.bomb.01.black").atLocation(centerMass).scale(0.5);
sequence
    .effect()
    .file("jb2a.explosion.08.orange")
    .atLocation(centerMass)
    .rotateTowards(sourceToken)
    .rotate(180)
    .center();
sequence
    .sound()
    .file("modules/lancer-weapon-fx/soundfx/Mortar_Impact.ogg")
    .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));

sequence = repeatImpactAnimationForEachTarget(sequence, targetTokens);

sequence.play();
