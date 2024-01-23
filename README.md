# lancer-weapon-fx
## Weapon visual and sound effects for use primarily with the Lancer TTRPG system on Foundry.
This module requires the following modules be installed: Token Magic FX, Sequencer, JB2A, Jack Kerouac's Animated Spell Effects and Spell Effects Cartoon.
Token Magic FX is used for the smoke grenade and smoke mine macros, Sequencer is used for the rest of the macros and the rest of the modules provide the assets.
The sound effects and macro icons are all included with this module.

## Usage

### Automatic

Once installed and activated, weapon FX should "just work" with all attack rolls, with the following provisions:

* The token making the attack must be selected (the active combatant is used as a fallback if no token is selected)
* The token(s) being attacked must be targeted
* The only weapons currently supported for automated FX are PC/NPC weapons from official Massif products (as of this writing: Core, The Long Rim, No Room For A Wallflower Pt. 1, Field Guide to the Karrakin Trade Baronies). Automatic FX for custom/homebrew weapons are currently not supported without modifying module code, though support for this is planned in a future release -- for the time being, using the Manual method is the recommended way to support unofficial content.

### Manual

#### Macros

The module installs a Macro compendium which you can use to apply effects to attacks manually. The recommended method for applying these FX manually is:

* Find the roll macro button for the weapon you wish to apply FX to and drag it to the Token Hotbar.
* Open the roll macro and copy the two IDs inside the `prepareItemMacro` call
* Create a new macro with the following text, pasting in the IDs from the above roll macro in the appropriate places

```
async function fxAttack(){
  await game.lancer.prepareItemMacro("//INSERT ID FROM ATTACK MACRO//", "//INSERT 2ND ID FROM ATTACK MACRO//");
    //FX FUNCTION CALL GOES HERE//
    }
    fxAttack();
```

* Open the FX macro from the compendium whose FX you want to apply, copy the content, and paste it into the `//FX FUNCTION CALL GOES HERE//` section in the macro
* Use the newly create macro for attacks with the weapon in future games

Video demonstration:

![weaponfxdemo](https://user-images.githubusercontent.com/76132631/155030217-4ee5c47e-00d5-49b8-8601-20117b0e9c08.gif)

#### Editing the list

If you have some technical knowledge, you can manually add custom entries to the list of hardcoded effects. This is useful for accounting for third-party content, which can potentially have many types of features replicated across multiple characters, meaning that managing macros for them could be a hassle.

To do this, navigate to the module's scripts `(Foundry installation directory)/Data/modules/lancer-weapon-fx/scripts` and open `weaponEffects.js` in your text editor of choice; from there you can add new entries as desired. The module checks the name of any given feature before checking its ID, so adding an effect to a weapon is as simple as just entering its name and the associated effect you want.

This example, appended to the bottom of the list, would make any Foundry feature with the name **Example Custom Weapon** use the Assault Rifle effect in the macro compendium when attacking:

```
    "Example Custom Weapon": "Assault Rifle",
```

You can add as many as you like:

```
    "Example Custom Weapon": "Assault Rifle",
    "Data Dart": "Nexus",
    "Gun That Makes You Stabilize": "Stabilize",
```

---

I am not a professional by any means and am open to suggestions and critiques.  I would love to improve this product and add new FX so please don't hesitate to leave a suggestion.
