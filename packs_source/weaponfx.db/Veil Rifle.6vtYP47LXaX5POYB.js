let target = Array.from(game.user.targets)[0];

let sequence = new Sequence();

for (let target of Array.from(game.user.targets)) {
    sequence.effect()
        .file("jb2a.bullet.Snipe.blue")
        .filter("ColorMatrix", {hue: 60})
        .filter("Glow", {distance: 3})
        .atLocation(canvas.tokens.controlled[0] ?? game.combat?.current?.tokenId)
        .stretchTo(target);
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/veil_rifle.ogg")
        .volume(0.5 * game.settings.get("lancer-weapon-fx", "volume"));
}
sequence.play();
