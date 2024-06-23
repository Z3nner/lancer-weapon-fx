//This Macro requires Warpgate module to function. When executed, the macro will play the explosion fx on the clicked location.  Useful for grenades or any other occurance where something needs to explode.

if (typeof warpgate === "undefined") ui.notifications.error("This macro requires the Warpgate module to be installed!");

let config = {
    size: 1,
    icon: "icons/White/bright-explosion.png",
    label: "Grenade",
    interval: 1,
};

let position = await warpgate.crosshairs.show(config);

await Sequencer.Preloader.preloadForClients(["jb2a.explosion.08.orange", "jb2a.explosion.shrapnel.bomb.01.black"]);

let sequence = new Sequence()

    .effect()
    .file("jb2a.explosion.08.orange")
    .atLocation(position)
    .name("impact")
    .delay(500)
    .effect()
    .file("jb2a.explosion.shrapnel.bomb.01.black")
    .atLocation(position)
    .name("impact")
    .scale(0.6)
    .delay(600)
    .sound("modules/lancer-weapon-fx/soundfx/Missile_Impact.ogg")
    .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
    .delay(500)

    .play();
