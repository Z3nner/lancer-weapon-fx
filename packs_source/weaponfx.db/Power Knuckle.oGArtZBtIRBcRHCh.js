let target = Array.from(game.user.targets)[0];

let sequence = new Sequence();

for (let target of Array.from(game.user.targets)) {
    sequence.effect()
        .file("jb2a.unarmed_strike.physical.02.blue")
        .scale(0.9)
        .atLocation(canvas.tokens.controlled[0] ?? game.combat?.current?.tokenId)
        .moveTowards(target);
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/knuckleswing.ogg")
        .delay(300)
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7));
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/knucklehit.ogg")
        .delay(600)
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.8))
        .waitUntilFinished(-100);
}
sequence.play();
