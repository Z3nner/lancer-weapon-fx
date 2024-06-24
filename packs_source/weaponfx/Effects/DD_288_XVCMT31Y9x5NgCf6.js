const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/DD288Full.ogg",
    "jb2a.unarmed_strike.physical.01.blue",
    "jb2a.explosion_side.01.orange",
    "jb2a.explosion.side_fracture.flask.01",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/DD288Full.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.6))
        .waitUntilFinished(-3400);
    sequence
    .effect()
        .file("jb2a.unarmed_strike.physical.01.blue")
        .filter("ColorMatrix", { hue: 000, brightness: 0.5 })
        .filter("Glow", { distance: 3, color: 0xe99649, innerStrength: 2 })
        .atLocation(sourceToken)
        .playbackRate(0.7)
        .scale(8)
        .stretchTo(target)
        .missed(targetsMissed.has(target.id))
        .name("impact")
        .waitUntilFinished(-650);

    sequence
    .effect()
        .file("jb2a.explosion_side.01.orange")
        .scaleToObject(6)
        .atLocation("impact")
        .rotateTowards(sourceToken)
        .rotate(180)
        .spriteOffset({ x: -2.9 }, { gridUnits: true })
        .zIndex(1);
    sequence
    .effect()
        .file("jb2a.explosion.side_fracture.flask.01")
        .playIf(!targetsMissed.has(target.id))
        .scaleToObject(3)
        .atLocation("impact")
        .rotateTowards(sourceToken)
        .rotate(180)
        .delay(200);
}
sequence.play();
