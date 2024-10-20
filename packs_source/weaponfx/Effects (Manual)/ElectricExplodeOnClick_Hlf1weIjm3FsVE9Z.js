// To use this Macro: After triggering the macro an indicator will appear to show the place where the explosion animation will play.  Left click to trigger the effect, Right click or Escape to cancel.

// Preload the explosion animations
await Sequencer.Preloader.preloadForClients([
    "jb2a.explosion.02.blue", 
    "jb2a.thunderwave.center.blue",
    "modules/lancer-weapon-fx/soundfx/AirBurst.ogg"
]);

// Create and add the preview icon to the canvas
const texture = PIXI.Texture.from("icons/pings/chevron.webp");
const preview = new PIXI.Sprite(texture);
preview.anchor.set(0.5);

// Get the texture's native aspect ratio
const aspectRatio = texture.width / texture.height;

// Set width based on grid size
const gridSize = canvas.grid.size;
if (texture.width > texture.height) {
    preview.width = gridSize;  // Scale by width
    preview.height = gridSize / aspectRatio;  // Scale height to maintain proportions
} else {
    preview.height = gridSize;  // Scale by height
    preview.width = gridSize * aspectRatio;  // Scale width to maintain proportions
}

canvas.stage.addChild(preview);

// Mouse move handler to update preview position
canvas.stage.on('mousemove', (event) => {
    const t = canvas.stage.worldTransform;
    const tx = ((event.data.global.x - t.tx) / canvas.stage.scale.x) * 1.01;
    const ty = ((event.data.global.y - t.ty) / canvas.stage.scale.y) * 1.01;

    // Get the grid-snapped position based on the translated world coordinates
    const snappedPos = canvas.grid.getSnappedPosition(tx, ty);
    
    // Adjust the preview position
    preview.position.set(snappedPos.x - gridSize / 4, snappedPos.y - gridSize / 2); // Original offsets for the preview
});

// Click handler to finalize and play the animation
canvas.stage.on('click', async (event) => {
    const t = canvas.stage.worldTransform;
    const tx = ((event.data.global.x - t.tx) / canvas.stage.scale.x) * 1.01;
    const ty = ((event.data.global.y - t.ty) / canvas.stage.scale.y) * 1.01;

    // Get the grid-snapped position based on the translated world coordinates
    const snappedPos = canvas.grid.getSnappedPosition(tx, ty);
    
    canvas.stage.off('mousemove').off('click').removeChild(preview);

    // Play the effects at the original positions
    new Sequence()
        .effect().file("jb2a.explosion.02.blue").atLocation({ x: snappedPos.x - gridSize / 4, y: snappedPos.y - gridSize / 6 }).delay(500)
        .effect().file("jb2a.thunderwave.center.blue").atLocation({ x: snappedPos.x - gridSize / 4, y: snappedPos.y - gridSize / 6 }).scale(0.6).delay(600)
        .sound("modules/lancer-weapon-fx/soundfx/AirBurst.ogg").volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7)).delay(500)
        .play();
});