// This will lay down a template suitable for designating the location of a delayed Pinaka Missile strike.

game.lancer.canvas.WeaponRangeTemplate.fromRange({
    type: "Blast",
    val: 2.0,
})
    .placeTemplate()
    .then(t => {
        if (t) {
            t.update({
                texture: Sequencer.Database.getEntry("jb2a.smoke.plumes_loop.01.grey.2").file,
                distance: 1.8,
                fillColor: "#756c6c",
            });
        }
    });
