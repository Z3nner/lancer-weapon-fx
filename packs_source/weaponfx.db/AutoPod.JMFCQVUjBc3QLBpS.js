let target = Array.from(game.user.targets)[0];

let sequence = new Sequence()

    .sound()
        .file("modules/lancer-weapon-fx/soundfx/AutoPod_Fire.ogg")
        .volume(0.7 * game.settings.get("lancer-weapon-fx", "volume"))
    .effect()
        .file("jb2a.template_circle.vortex.loop.blue")
        .endTime(4700)
        .scale(0.20)
        .tint("#787878")
        .atLocation(canvas.tokens.controlled[0] ?? game.combat?.current?.tokenId)
        .moveTowards(target)
        .waitUntilFinished()
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Autopod_Impact.ogg")
        .volume(0.7 * game.settings.get("lancer-weapon-fx", "volume"))
    .effect()
        .file("jb2a.impact.yellow.1")
        .scale(.6)
        .atLocation(target)

    .play();