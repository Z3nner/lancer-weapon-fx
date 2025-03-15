const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const target = targetTokens[0];

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/DisplacerFire.ogg",
    "jb2a.energy_strands.range.multiple.purple.01",
    "modules/lancer-weapon-fx/soundfx/DisplacerHit2.ogg",
    "jb2a.divine_smite.caster.blueyellow",
]);

let sequence = new Sequence()

    .sound()
        .file("modules/lancer-weapon-fx/soundfx/DisplacerFire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.8))
        .startTime(900)
        .fadeInAudio(500)
    .effect()
        .file("jb2a.energy_strands.range.multiple.purple.01")
        .scale(0.4)
        .atLocation(sourceToken)
        .stretchTo(target)
        .missed(targetsMissed.has(target.id))
        .waitUntilFinished(-1100);

sequence
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/DisplacerHit2.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.8))
        .playIf(!targetsMissed.has(target.id))
        .delay(300)
    .effect()
        .file("jb2a.divine_smite.caster.blueyellow")
        .playIf(!targetsMissed.has(target.id))
        .scaleToObject(3)
        .tint("#9523e1")
        .filter("Glow", { color: 0xffffff, distance: 1 })
        .atLocation(target)
        .waitUntilFinished(-1000);

sequence.play();
