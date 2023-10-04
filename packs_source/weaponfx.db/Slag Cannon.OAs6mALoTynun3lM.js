let target = Array.from(game.user.targets)[0];
let scale = 0.1 * target.actor.system.derived.mm.Size;
let sequence = new Sequence()
   
     .sound()
        .file("modules/lancer-weapon-fx/soundfx/CPR_Fire.ogg")
    .effect()
        .file("jb2a.energy_strands.complete.blue.01")
        .tint("#ceb673")
        .endTime(1500)
        .scale(0.10)
        .atLocation(canvas.tokens.controlled[0] ?? game.combat?.current?.tokenId)
        .moveTowards(target)
        .waitUntilFinished(200)
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/DisplacerHit1.ogg")
        .repeats(3, 100)
        .volume(0.6 * game.settings.get("lancer-weapon-fx", "volume"))
    sequence.effect()
        .file("jb2a.impact.blue")
        .tint("#ceb673")
        .scale(0.3)
        .atLocation(target, {randomOffset: 0.9})
        .repeats (3, 100)

    .play();