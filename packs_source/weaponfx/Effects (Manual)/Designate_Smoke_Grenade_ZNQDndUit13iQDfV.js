// This will lay down a template suitable for designating the location of a delayed Pinaka Missile strike.

game.lancer.canvas.WeaponRangeTemplate.fromRange({
    type: "Blast",
    val: 2.0,
})
    .placeTemplate()
    .then(t => {
        if (t) {
            t.update({
                texture: "modules/JB2A_DnD5e/Library/Generic/Smoke/SmokePlumes01_03_Regular_Grey_400x400.webm",
                distance: 1.8,
                fillColor: "#756c6c",
            });
        }
    });
