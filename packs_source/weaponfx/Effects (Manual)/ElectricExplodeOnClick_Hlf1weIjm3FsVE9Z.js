//This Macro requires Warpgate module to function. When executed, the macro will play the explosion fx on the clicked location.  Useful for grenades or any other occurance where something needs to explode.

if (typeof warpgate === "undefined") ui.notifications.error("This macro requires the Warpgate module to be installed!");

let config = {
    size:2,
    icon: 'icons/White/crowned-explosion.png',
    label: 'EGrenade',
    interval: 1
}

let position = await warpgate.crosshairs.show(config);

await Sequencer.Preloader.preloadForClients(["jb2a.explosion.02.blue", "jb2a.thunderwave.center.blue"])

let sequence = new Sequence()

    .effect()
        .file("jb2a.explosion.02.blue")
        .atLocation(position)
        .scale(0.8)
        .name("impact")
        .delay(500)
        .opacity(0.8)
    .effect()
        .file("jb2a.thunderwave.center.blue")
        .atLocation(position)
        .name("impact")
        .scale(0.6)
        .scaleOut(2, 400)
        .delay(600)
    .sound("modules/lancer-weapon-fx/soundfx/AirBurst.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
        .delay(500)


.play();
