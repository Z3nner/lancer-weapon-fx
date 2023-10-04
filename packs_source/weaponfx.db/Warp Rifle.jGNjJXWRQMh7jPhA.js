let target = Array.from(game.user.targets)[0];
let scale = 0.1 * target.actor.system.derived.mm.Size;
let sequence = new Sequence()
   
     .sound()
        .file("modules/lancer-weapon-fx/soundfx/DisplacerFire.ogg")
        .startTime(900)
        .fadeInAudio(500)
    .effect()
        .file("jb2a.energy_strands.range.multiple.purple.01")
        .scale(0.40)
        .atLocation(canvas.tokens.controlled[0])
        .stretchTo(target)
        .waitUntilFinished(-600)
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/DisplacerHit2.ogg")
        .delay(300)
    .effect()
        .file("jb2a.divine_smite.caster.blueyellow")
        .scale(.9)
        .tint("#9523e1")
        .atLocation(target)
        .waitUntilFinished(-1000)


    .play();