let target = Array.from(game.user.targets)[0];

let sequence = new Sequence();

for (let target of Array.from(game.user.targets)) {
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Annihilator_Charge.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence.effect()
        .file("jb2a.eldritch_blast.purple")
        .startTime(900)
        .scale(.86)
        .atLocation(canvas.tokens.controlled[0] ?? game.combat?.current?.tokenId)
        .stretchTo(target)
        .waitUntilFinished(-4000);
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Annihilator.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence.effect()
        .file("jb2a.impact.blue.3")
        .scale(1.0)
        .tint("#c91af9")
        .atLocation(target)
        .waitUntilFinished(-400);
}
sequence.play();
