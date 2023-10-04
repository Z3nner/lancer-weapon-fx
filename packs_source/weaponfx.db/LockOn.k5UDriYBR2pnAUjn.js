let target = Array.from(game.user.targets)[0];
let scale = 0.25 * target.actor.system.derived.mm.Size;
let sequence = new Sequence();

for (let target of Array.from(game.user.targets)) {
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/LockOn.ogg");
    sequence.effect()
        .file("jb2a.zoning.inward.square.loop.bluegreen.01.01")
        .atLocation(target)
        .scale(scale);
}

sequence.play();
