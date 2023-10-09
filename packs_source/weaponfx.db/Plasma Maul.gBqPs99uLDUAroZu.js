let target = Array.from(game.user.targets)[0];

let sequence = new Sequence();

for (let target of Array.from(game.user.targets)) {
    sequence.effect()
        .file("jb2a.warhammer.melee.01.white.4")
        .tint("#18f014")
        .atLocation(canvas.tokens.controlled[0] ?? game.combat?.current?.tokenId)
        .moveTowards(target);
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Axe_swing.ogg")
        .delay(1300)
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7));
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Axe_Hit.ogg")
        .delay(1550)
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7));
    sequence.effect()
        .file("jb2a.impact.blue.3")
        .scale(1.2)
        .tint("#18f014")
        .atLocation(target)
        .delay(1550)
        .waitUntilFinished(-1000);
}
sequence.play();
