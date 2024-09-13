// This will lay down a template suitable for designating the location of a delayed Pinaka Missile strike.

game.lancer.canvas.WeaponRangeTemplate.fromRange({
    type: "Blast",
    val: 2,
})
    .placeTemplate()
    .then(t => {
        if (t) {
            t.update({
                texture:
                    "jb2a.zoning.inward.square.loop.bluegreen.01.01",
                distance: 1,
                fillColor: "#FF0000",
            });
        }
    });
