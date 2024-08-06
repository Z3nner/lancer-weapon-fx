# lancer-weapon-fx
## Weapon visual and sound effects for use primarily with the Lancer TTRPG system on Foundry.
This module requires Sequencer and either the free or patreon version of JB2A.  Sequencer provides a simple and intuitive API for creating cool special effects, and JB2A provides a library of effects for Sequencer to use.

A few macros within the manual effects compendium, not linked to any items, require Warpgate to run.

## Usage

### Automatic

Once installed and activated, weapon FX should "just work" with all attack rolls and most tech attacks.

Lancer Weapon FX will strive to support all first party Massif Press content with out of the box macros that work whenever you roll an weapon attack. This support may lag significantly behind the release of the content.

For third party content, the Effects Manager should be able to handle all the items used at your table.

### Manual

The Effects Manager located in the module settings allows the user to drag and drop most items into the  manager to start a new item/macro pairing.  You can select a premade macro from LwFX or drag and drop your own macro to the applicable effect to complete the pairing.  You can organize your custom pairings into folders and import/export your configurations.

#### Modifying Default Effects

If you'd like to change any effect, or replace an existing effect with your own, simply drag any existing copy of the weapon into the effect manager, then drag your new or modified macro onto the new effect stub.  The module will prioritize items linked via the effects manager above all other sources.

#### Non-item effects

Effects for some non-item actions and rolls are supported. Default effects for many of these are planned.  If you'd like to add an effect or replace a default one with your own, you can enter any of the following keys into the Lancer ID of an effect stub in the Effects Manager.

##### Supported Actions
```
lwfx_core_power
lwfx_cascade
lwfx_overcharge
lwfx_stabilize
```

Effects assigned to ``lwfx_stabilize`` will also trigger with Full Repair.

##### Reactor Stress
```
  lwfx_overheat_emergency_shunt
  lwfx_overheat_destabilized_power_plant
  lwfx_overheat_meltdown_3
  lwfx_overheat_meltdown_2
  lwfx_overheat_meltdown_1
  lwfx_overheat_irreversible_meltdown
```

The number at the end of ``lwfx_overheat_meltdown_`` and ``lwfx_structure_direct_hit_`` refers to the number of stress or structure remaining.  ``meltdown_3`` means 3 stress remaining.

> [!NOTE]
> If you are using the [LANCER Alternative Structure](https://foundryvtt.com/packages/lancer-alt-structure) module, `lwfx_overheat_destabilized_power_plant` and `lwfx_overheat_irreversible_meltdown` are replaced with the following:
>
> ```
>  lwfx_overheat_destabilized_power_plant → lwfx_overheat_power_failure
>  lwfx_overheat_irreversible_meltdown    → lwfx_overheat_critical_reactor_failure
> ```



##### Structure Damage
```
  lwfx_structure_glancing_blow
  lwfx_structure_system_trauma
    lwfx_structure_secondary
  lwfx_structure_direct_hit_3
  lwfx_structure_direct_hit_2
  lwfx_structure_direct_hit_1
  lwfx_structure_crushing_hit
```

> [!TIP]
> ``lwfx_structure_system_trauma`` triggers on the first part of the roll, the d6 resulting in System Trauma. ``lwfx_structure_secondary`` is for the second part of the System Trauma roll, the roll between losing a weapon or a system.

> [!TIP]
> To reuse the same animation for different results, make an effect stub for each key from the list above, and drag the desired macro onto each stub.

#### Linking Actors to Folders

By default, folders help organize effects for all actors.  However, if you'd prefer to create a folder of effects to customize just a single actor, first create a new folder in the effects manager, then drag the actor from the actor tab to the new folder.  Effects in this folder will only apply to the linked actor.

[actor-link-unlink.webm](https://github.com/user-attachments/assets/93ed3a75-0389-4acf-90b8-1f037f3adbc8)
