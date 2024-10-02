// This will lay down a template suitable for designating the location of a delayed Pinaka Missile strike.

game.lancer.canvas.WeaponRangeTemplate.fromRange({
    type: "Blast",
    val: 2,
})
    .placeTemplate()
    .then(t => {
        if (t) {
            t.update({
                texture: Sequencer.Database.getEntry("jb2a.zoning.inward.square.loop.bluegreen.01.01").file,
                distance: 1,
                fillColor: "#FF0000",
            });
        }
    });
