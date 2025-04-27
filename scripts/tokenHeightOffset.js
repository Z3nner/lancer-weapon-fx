export default class tokenHeightOffset {
    static getTokenHeightOffset({
        targetToken,
        randomOffset_ = false,
        sprayOffset = false,
        missed = false,
        moveTowards = false,
        tokenHeightPercent = 0.6,
        ignoreElevation = false,
    } = {}) {
        // Check if the current canvas is isometric
        const isIsometric = tokenHeightOffset.isIsometric();

        if (targetToken === undefined || targetToken === null) {
            // check if targetToken is null and post a foundry notification if it is and then return
            ui.notifications.error("No targetToken provided, can't get token object.");
            return;
        }

        // get the token half height location
        const tokenHeight = targetToken.verticalHeight;
        // if we're ignoring elevation, set the token elevation to 0
        let tokenElevation = ignoreElevation ? 0 : targetToken.document.elevation;
        const halfTokenHeight = tokenHeight * tokenHeightPercent;

        // build the dict!!
        const heightOffset = {
            offset: { x: tokenElevation + halfTokenHeight, y: -halfTokenHeight - tokenElevation },
            gridUnits: true,
        };

        // If the map is not isometric, we don't want to have the height/elevation offset since the target will be the middle of the token
        // so we set the x and y values to 0
        if (!isIsometric) {
            heightOffset.offset.x = 0;
            heightOffset.offset.y = 0;
        }

        // if sprayOffset is true and missed is false, add a random offset to the x and y values
        if (sprayOffset && !missed) {
            const randomHeightOffset =
                (Math.random() < 0.25 ? -0.5 : 1) * Math.random() * halfTokenHeight * tokenHeightPercent;

            const targetOffsetX =
                (Math.random() < 0.5 ? -1 : 1) * Math.random() * halfTokenHeight * (tokenHeightPercent / 2);
            const targetOffsetY =
                (Math.random() < 0.5 ? -1 : 1) * Math.random() * halfTokenHeight * (tokenHeightPercent / 2);

            // if the map is not isometric, we want to kill the height/elevation offset since the target will be the middle of the token
            if (!isIsometric) {
                tokenElevation = 0;
                halfTokenHeight = 0;
            }

            heightOffset.offset = {
                x: tokenElevation + halfTokenHeight + randomHeightOffset + targetOffsetX,
                y: -halfTokenHeight - randomHeightOffset - targetOffsetY - tokenElevation,
            };
        }

        // if an offset has been provided, add it to the dict
        if (randomOffset_ !== null) {
            heightOffset.randomOffset = randomOffset_;
        }

        // movetowards needs special handling since we need to get the target token x and y coordinates
        // of the whole map, and not just the offset
        if (moveTowards) {
            // target token x and y coordinates
            const targetX = targetToken.center.x;
            const targetY = targetToken.center.y;
            // get the current map grid scale
            const gridScale = canvas.scene.grid.size;
            // multiply the x and y values by the grid scale
            heightOffset.offset.x *= gridScale;
            heightOffset.offset.y *= gridScale;
            // add the actual map coordinates to the x and y values
            heightOffset.offset.x += targetX;
            heightOffset.offset.y += targetY;
            return heightOffset.offset;
        }
        return heightOffset;
    }

    static isIsometric() {
        // Check if the current canvas is isometric
        return canvas.scene.flags["grape_juice-isometrics"].is_isometric;
    }
}
