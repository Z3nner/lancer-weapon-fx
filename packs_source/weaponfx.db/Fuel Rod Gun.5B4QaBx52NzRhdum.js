let target = Array.from(game.user.targets)[0];

let sequence = new Sequence()
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/APR2_Load.ogg")
        .volume(0.5 * game.settings.get("lancer-weapon-fx", "volume"))
        .waitUntilFinished()
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/APR2_Fire.ogg")
        .volume(0.5 * game.settings.get("lancer-weapon-fx", "volume"))
    .effect()
        .file("jb2a.lasershot.green")
        .atLocation(canvas.tokens.controlled[0])
        .stretchTo(target)
        .scale(2.0)
        .waitUntilFinished(-300)
    .effect()
        .file("jb2a.toll_the_dead.green.shockwave") 
        .atLocation(target)
        .scale(0.7)
        .zIndex(1)
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/APR2_Impact.ogg")
        .volume(0.5 * game.settings.get("lancer-weapon-fx", "volume"))
    .play();