/**
 * TokenHeightOffset - Handles token height and elevation calculations for visual effects
 *
 * This utility class calculates the appropriate height offsets for tokens in both
 * isometric and standard grid projections. It's primarily used to position visual effects
 * correctly relative to tokens based on their elevation, height, and other factors.
 *
 * @example
 * // Basic usage
 * const offset = TokenHeightOffset.getTokenHeightOffset({
 *   targetToken: token,
 *   tokenHeightPercent: 0.5
 * });
 *
 * // Use with spray effect
 * const sprayOffset = TokenHeightOffset.getTokenHeightOffset({
 *   targetToken: token,
 *   sprayOffset: true
 * });
 */
export default class TokenHeightOffset {
    /**
     * Calculate token height offset based on provided parameters
     *
     * This method calculates appropriate height offsets for tokens, taking into account
     * the token's elevation, height, and whether the scene is using isometric projection.
     * The returned offset can be used to position visual effects correctly relative to the token.
     *
     * @param {object} options - Configuration options
     * @param {Token} options.targetToken - The target token to calculate offsets for
     * @param {boolean|integer} [options.randomOffset=false] - Whether to apply a random offset to the effect (useful for spray )
     * @param {boolean|integer} [options.sprayOffset=false] - Whether to apply a spray pattern offset (useful for area effects)
     * @param {boolean} [options.missed=false] - Whether the attack missed (changes height calculation)
     * @param {boolean} [options.useAbsoluteCoords=false] - Whether to calculate absolute coordinates
     * @param {number} [options.tokenHeightPercent=0.6] - Percentage of token height to use (0.0 = bottom, 0.5 = middle, 1.0 = top)
     * @param {boolean} [options.ignoreElevation=false] - Whether to ignore token elevation in calculations
     * @returns {object|undefined} The calculated height offset or undefined if no token provided:
     *   - For standard returns: { offset: { x, y }, gridUnits: true, [randomOffset]: boolean }
     *   - For useAbsoluteCoords=true returns: { x, y } absolute coordinates
     *
     * @example
     * // Get offset for a missable attack in a macro
     * const targetHeightOffset = game.modules
     *  .get("lancer-weapon-fx")
     *  .api.getTokenHeightOffset({
     *      targetToken: target,
     *      sprayOffset: true,
     *      missed: targetsMissed.has(target.id),
     *  });
     */
    static getTokenHeightOffset({
        targetToken,
        randomOffset_ = false,
        sprayOffset = false,
        missed = false,
        useAbsoluteCoords = false,
        tokenHeightPercent = 0.6,
        ignoreElevation = false,
    } = {}) {
        // Check if the current canvas is isometric
        const isIsometric = this.isIsometric();

        if (!targetToken) {
            // if we haven't gotten a target token post a foundry notification if it is and then return
            ui.notifications.error("LWFX getTokenHeightOffset - No targetToken provided, can't get token object!");
            return;
        }

        // get the token half height location
        const tokenHeight = targetToken.verticalHeight;
        // Calculate token elevation and height based on conditions
        // For non-isometric maps or when configured to ignore elevation, we don't apply height/elevation offsets
        const tokenElevation = !isIsometric || ignoreElevation ? 0 : targetToken.document.elevation;
        const halfTokenHeight = tokenHeight * tokenHeightPercent;
        const tokenHeightOffset = !isIsometric || missed ? 0 : halfTokenHeight;

        // build the dict!!
        let heightOffset = {
            offset: { x: tokenElevation + tokenHeightOffset, y: -tokenHeightOffset - tokenElevation },
            gridUnits: true,
            randomOffset: randomOffset_,
        };

        // if sprayOffset is true and missed is false, add a random offset to the x and y values
        if (sprayOffset && !missed) {
            this._applySprayOffset(heightOffset, sprayOffset, tokenHeight, tokenHeightOffset);
        }

        // moveTowards & rotateTowards need special handling since we need to get the target token x and y coordinates
        // of the whole map, and not just the offset. So we convert to absolute coordinates.
        if (useAbsoluteCoords) {
            return this.calculateAbsoluteCoordinates(targetToken, heightOffset);
        }

        return heightOffset;
    }

    /**
     * Applies a random spray offset to the height offset coordinates
     *
     * This function modifies the provided height offset with random values to create
     * a spray pattern effect. When in isometric mode, it adds additional height variation
     * to compensate for the visual squishing effect of isometric projection.
     *
     * @param {object} heightOffset - The height offset object to modify
     * @param {boolean|number} sprayOffset - Whether to apply spray offset or specific spray intensity value
     * @param {number} tokenHeight - The height of the token in grid units
     * @param {number} tokenHeightOffset - The calculated token height offset
     *
     * @example
     * // Apply spray offset to a height offset object
     * TokenHeightOffset.applySprayOffset(
     *   heightOffset,
     *   true,
     *   token.verticalHeight,
     *   TokenHeightOffset.isIsometric(),
     *   calculatedHeightOffset
     * );
     */
    static _applySprayOffset(heightOffset, sprayOffset, tokenHeight, tokenHeightOffset) {
        // Check if the current canvas is isometric
        const isIsometric = this.isIsometric();

        // if sprayOffset is a number, use that as number for the spray's random offset
        const randomSprayOffset = typeof sprayOffset === "number" ? sprayOffset : 0.5;

        console.log("sprayOffset", randomSprayOffset);
        console.log("tokenHeightOffset", tokenHeightOffset);

        // need to add an additional height offset in iso because when
        // displayed in iso the spray offset is squished
        let randomHeightOffset = isIsometric ? (Math.random() < 0.5 ? -0.5 : 1) * Math.random() * randomSprayOffset : 0;

        console.log("randomHeightOffset", randomHeightOffset);

        const targetOffsetX = (Math.random() < 0.5 ? -1 : 1) * Math.random() * ((tokenHeight / 2) * randomSprayOffset);
        const targetOffsetY = (Math.random() < 0.5 ? -1 : 1) * Math.random() * ((tokenHeight / 2) * randomSprayOffset);

        console.log("targetOffsetX", targetOffsetX);
        console.log("targetOffsetY", targetOffsetY);

        heightOffset.offset.x += randomHeightOffset + targetOffsetX;
        heightOffset.offset.y -= randomHeightOffset - targetOffsetY;
    }

    /**
     * Calculates absolute canvas coordinates based on target token and height offset
     *
     * This converts relative height offset coordinates into absolute canvas coordinates,
     * taking into account the token's position and the current grid scale.
     * Primarily used for moveTowards and rotateTowards effects that need precise
     * positioning on the canvas.
     *
     * @param {Token} targetToken - The target token
     * @param {object} heightOffset - The height offset object with relative coordinates
     * @returns {object} The absolute canvas coordinates: { x, y }
     *
     * @example
     * const absoluteCoords = TokenHeightOffset.calculateAbsoluteCoordinates(
     *   token,
     *   { offset: { x: 1, y: -0.5 }, gridUnits: true }
     * );
     */
    static calculateAbsoluteCoordinates(targetToken, heightOffset) {
        // target token x and y coordinates
        const targetX = targetToken.center.x;
        const targetY = targetToken.center.y;
        // get the current map grid scale
        const gridScale = canvas.scene.grid.size;
        // multiply the x and y values by the grid scale
        const x = heightOffset.offset.x * gridScale + targetX;
        const y = heightOffset.offset.y * gridScale + targetY;

        return { x, y };
    }

    /**
     * Check if the current canvas is using isometric projection
     *
     * Detects whether the current scene is using isometric projection
     * by checking for compatible isometric modules.
     *
     * @returns {boolean} Whether the current scene uses isometric projection
     *
     * @example
     * if (TokenHeightOffset.isIsometric()) {
     *   // Apply isometric-specific calculations
     * }
     */
    static isIsometric() {
        // Check if the current canvas is isometric
        // First check if the modules and their flags exist to avoid errors
        const hasGrapeJuice =
            game.modules.get("grape_juice-isometrics")?.active &&
            canvas.scene.flags["grape_juice-isometrics"] !== undefined;

        const hasIsometricPerspective =
            game.modules.get("isometric-perspective")?.active &&
            canvas.scene.flags["isometric-perspective"] !== undefined;

        // If grape juice is active and has flags set, check its isometric setting
        if (hasGrapeJuice) {
            return canvas.scene.flags["grape_juice-isometrics"].is_isometric;
        }

        // If isometric perspective is active and has flags set, check its isometric setting
        if (hasIsometricPerspective) {
            return canvas.scene.flags["isometric-perspective"].isometricEnabled;
        }

        // If no isometric modules are enabled, return false
        return false;
    }
}
