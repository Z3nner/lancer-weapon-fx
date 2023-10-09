let target = Array.from(game.user.targets)[0];

let sequence = new Sequence();

for (let target of Array.from(game.user.targets)) {
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/shotgun_cycle.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/shotgun_fire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .delay(500);
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/shotgun_impact.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .delay(800);
    sequence.effect()
        .file("jb2a.bullet.01.orange")
        .atLocation(canvas.tokens.controlled[0] ?? game.combat?.current?.tokenId)
        .scale(0.9)
        .stretchTo(target, {randomOffset: 0.7})
        .repeats(6)
        .delay(500)
        .waitUntilFinished(-100);
}
sequence.play();
