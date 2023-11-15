// This will lay down a template suitable for designating the location of a delayed Pinaka Missile strike.

game.lancer.canvas.WeaponRangeTemplate.fromRange({
    type: "Blast",
    val: 2,
}).placeTemplate()
    .then(t => {
        if (t) {
            t.update({texture: "modules/JB2A_DnD5e/Library/Generic/Zoning/ZoningSquare01In_01_Regular_BlueGreen_Loop_600x600.webm", distance: 1, fillColor: "#FF0000" });
        };
    }
)