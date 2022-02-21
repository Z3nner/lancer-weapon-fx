# lancer-weapon-fx
## Weapon visual and sound effects for use primarily with the Lancer TTRPG system on Foundry.
This module requires the following modules be installed: Token Magic FX, Sequencer, JB2A, Jack Kerouac's Animated Spell Effects and Spell Effects Cartoon.
Token Magic FX is used for the smoke grenade and smoke mine macros, Sequencer is used for the rest of the macros and the rest of the modules provide the assets.
The sound effects and macro icons are all included with this module.

Lancer Weapon FX will add a compendium with several macros for your use.  I recommend using the Token Hotbar macro to drag macros for player's equipped weapons directly to their hotbar.
These macros can be coupled with a player's attack rolls by first dragging the dice icon for a weapon to the hotbar and then appending the following code snippets around the macro as the video below shows.

```
async function fxAttack(){
  await game.lancer.prepareItemMacro("//INSERT ID FROM ATTACK MACRO//", "//INSERT 2ND ID FROM ATTACK MACRO//";
    //FX FUNCTION CALL GOES HERE//
    }
    fxAttack();
```

[INSERT GIF LATER]

I am not a professional by any means and am open to suggestions and critiques.  I would love to improve this product and add new FX.
