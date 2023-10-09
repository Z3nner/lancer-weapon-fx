let target = Array.from(game.user.targets)[0];

let sequence = new Sequence();

for (let target of Array.from(game.user.targets)) {
    sequence.effect()
        .file("jb2a.sword.melee.01.white")
        .tint("#080303")
        .scale(0.8)
        .atLocation(canvas.tokens.controlled[0] ?? game.combat?.current?.tokenId)
        .moveTowards(target);
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/bladeswing.ogg")
        .delay(900)
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7));
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/bladehit.ogg")
        .delay(1000)
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7));
    sequence.effect()
        .file("jb2a.impact.blue")
        .scale(1.2)
        .atLocation(target)
        .delay(1000)
        .waitUntilFinished(-1500);
}
sequence.play();
