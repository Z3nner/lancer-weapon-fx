let target = Array.from(game.user.targets)[0];

let sequence = new Sequence()

    .sound()
        .file("modules/lancer-weapon-fx/soundfx/AutoPod_Fire.ogg")
        .volume(0.7 * game.settings.get("lancer-weapon-fx", "volume"))
    .effect()
        .file("jb2a.lightning_ball.blue")
        .endTime(1500)
        .scale(0.2)
        .atLocation(canvas.tokens.controlled[0] ?? game.combat?.current?.tokenId)
        .moveTowards(target)
        .waitUntilFinished()
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/AirBurst.ogg")
        .volume(0.5 * game.settings.get("lancer-weapon-fx", "volume"))
    .effect()
        .file("jb2a.explosion.02.blue")
        .scale(0.5)
        .atLocation(target)
        .waitUntilFinished()
    .play();