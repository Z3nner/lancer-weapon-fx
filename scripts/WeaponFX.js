import { weaponEffects } from "./weaponEffects.js";

async function _executeMacroByName(
    macroName,
    sourceToken = {},
    targetTokens = [],
    compendiumName = "lancer-weapon-fx.WeaponFX"
) {
    const pack = game.packs.get(compendiumName);
    if (pack) {
        const macro_data = (await pack.getDocuments()).find((i) => i.data.name === macroName)?.toObject();

        if (macro_data) {
            const temp_macro = new Macro(macro_data);
            temp_macro.data.permission.default = CONST.DOCUMENT_PERMISSION_LEVELS.OWNER;
            temp_macro.execute(sourceToken, targetTokens);
        } else {
            ui.notifications.error("Lancer Weapon FX | Macro " + macroName + " not found");
        }
    } else {
        ui.notifications.error("Lancer Weapon FX | Compendium " + compendiumName + " not found");
    }
}

function _getTokenByIdOrActorId(id) {
    let token = canvas.tokens.get(id);
    if (!token) {
        token = canvas.tokens.ownedTokens.filter(t => t.actor.id == id)?.[0];
        if (!token) {
            console.log("Lancer Weapon FX | No token with id '" + id + "' found.");
            return {};
        }
    }
    return token;
}

Hooks.once("sequencer.ready", async function () {
    // preload effects data
    await Sequencer.Preloader.preload([
        "jb2a.arrow.physical.blue",
        "jb2a.breath_weapons02.burst.line.fire.orange.01",
        "jb2a.bolt.physical.orange",
        "jb2a.bullet.01.orange",
        "jb2a.bullet.Snipe.blue",
        "jb2a.burning_hands.01.orange",
        "jb2a.chain_lightning.primary.blue",
        "jb2a.claws.400px.red",
        "jb2a.dancing_light.purplegreen",
        "jb2a.disintegrate.green",
        "jb2a.divine_smite.caster.blueyellow",
        "jb2a.divine_smite.target.blueyellow",
        "jb2a.eldritch_blast.purple",
        "jb2a.energy_beam.normal.bluepink.02",
        "jb2a.energy_strands.complete.blue.01",
        "jb2a.explosion.01.orange",
        "jb2a.explosion.03.blueyellow",
        "jb2a.explosion.blue",
        "jb2a.fireball.beam.orange",
        "jb2a.fireball.explosion.orange",
        "jb2a.fire_jet.orange",
        "jb2a.fumes.steam.white",
        "jb2a.greataxe.melee.standard.white",
        "jb2a.healing_generic.400px.green",
        "jb2a.impact.004.blue",
        "jb2a.impact.blue",
        "jb2a.impact.ground_crack.orange",
        "jb2a.impact.orange.0",
        "jb2a.impact.orange.3",
        "jb2a.impact.yellow",
        "jb2a.lasershot.blue",
        "jb2a.lasershot.green",
        "jb2a.lasersword.melee.blue",
        "jb2a.lightning_ball.blue",
        "jb2a.lightning_bolt.narrow.blue",
        "jb2a.magic_missile.purple",
        "jb2a.spear.melee.01.white.2",
        "jb2a.sword.melee.01.white",
        "jb2a.template_circle.vortex.loop.blue",
        "jb2a.toll_the_dead.green.shockwave",
        "jb2a.unarmed_strike",
        "jb2a.warhammer.melee.01.white.4",
        "jb2a.zoning.inward.square.loop.bluegreen.01.01",
        "modules/lancer-weapon-fx/icons/LatchDrone.png",
        "modules/animated-spell-effects/spell-effects/air/black_smoke_RAY_01.webm",
        "modules/animated-spell-effects/spell-effects/energy/energy_throw_RAY_10.webm",
        "modules/animated-spell-effects/spell-effects/energy/energy_explosion_CIRCLE_05.webm"
        ], true);
    console.log('Lancer Weapon FX | Effects preloaded');
});
// Every time a chat message is posted...
Hooks.on("createChatMessage", (data) => {
        // output the chat message data to console for easy reading
        if(game.user.id !== data.user.id) return
        let chatMessageDataContent = data.data.content ?? '';
        // Parse the chat message as XML so that we can navigate through it
        const parser = new DOMParser();
        const chatMessage = parser.parseFromString(chatMessageDataContent, "text/xml");
        // try to get macro details from reroll data
        // reroll data is embedded in the chat message under the reroll link in the `data-macro` attribute of the reroll <a> tag.
        // the reroll data is a JSON string that has been `encodeURIComponent`'d and then base64-encoded.
        let encodedRerollData = chatMessage.querySelectorAll("[data-macro]")?.[0].getAttribute("data-macro");
        if (!encodedRerollData) {
            return;
        }
        let rerollData = JSON.parse(decodeURIComponent(atob(encodedRerollData)));
        const sourceInfo = rerollData.args[0];
        const weaponItemId = rerollData.args[1];
        const targetTokens = rerollData.args[3].targets.map(t =>_getTokenByIdOrActorId(t.target_id));
        let sourceToken = _getTokenByIdOrActorId(sourceInfo.id);
        const weaponLID = sourceToken.actor.items.get(weaponItemId)?.data.data.lid;

        const macroName = weaponEffects[weaponLID];
        if (macroName) {
            console.log("Lancer Weapon FX | Found macro '" + macroName + "' for weapon '" + weaponLID + "', playing animation");
            _executeMacroByName(macroName, sourceToken, targetTokens);
        }

async function _executeMacroByName(
    macroName,
    sourceToken = {},
    targetTokens = [],
    compendiumName = "lancer-weapon-fx.WeaponFX"
) {
    const pack = game.packs.get(compendiumName);
    if (pack) {
        const macro_data = (await pack.getDocuments()).find((i) => i.data.name === macroName)?.toObject();

        if (macro_data) {
            const temp_macro = new Macro(macro_data);
            temp_macro.data.permission.default = CONST.DOCUMENT_PERMISSION_LEVELS.OWNER;
            temp_macro.execute(sourceToken, targetTokens);
        } else {
            ui.notifications.error("Macro " + macroName + " not found");
        }
    } else {
        ui.notifications.error("Compendium " + compendiumName + " not found");
    }
}

function _getTokenByIdOrActorId(id) {
    let token = canvas.tokens.get(id);
    if (!token) {
        token = canvas.tokens.ownedTokens.filter(t => t.actor.id == id)?.[0];
        if (!token) {
            console.log("No token with id '" + id + "' found.");
            return {};
        }
    }
    return token;
}

const weapon_effects = {"npcf_devils_cough_shotgun_assassin": "Shotgun", "mw_exo_steelpunch_heavy_needlebeam": "Needle Beam", "mw_exo_sting_heavy_anti_armor_rifle": "AMR", "npcf_acid_spittle_monstrosity": "Nanobot Whip", "mw_andromeda_pattern_heavy_laser_rifle": "Lasers", "mw_annihilation_nexus": "Nexus", "mw_annihilator": "Annihilator", "npcf_anti_armor_weapon_human": "AMR", "npcf_anti_armor_weapon_squad": "AMR", "mw_anti_materiel_rifle": "AMR", "npcf_anti_materiel_rifle_sniper": "AMR", "mw_barbarossa_integrated": "Apocalypse Rail", "mw_arc_projector": "PPC", "mw_assault_cannon": "HMG", "mw_assault_rifle": "Assault Rifle", "mw_autogun": "Assault Rifle", "mw_autopod": "AutoPod", "mw_blackspot_targeting_laser": "LockOn", "npcf_boarding_leash_pirate": "DefaultMelee", "mw_bolt_nexus": "Nexus", "mw_bolt_thrower": "Bolt Thrower", "npcf_bombard_cannon_bombard": "Apocalypse Rail", "mw_bristlecrown_flechette_launcher": "Flechette Launcher", "mw_exo_brood_siblings_molt": "Brood Siblings Molt", "mw_burst_launcher": "Burst Launcher", "npcf_carbon_fiber_sword_ronin": "DefaultMelee", "mw_catalyst_pistol": "Plasma Rifle", "mw_catalytic_hammer": "DefaultMelee", "mw_chain_axe": "DefaultMelee", "npcf_chain_axe_berserker": "DefaultMelee", "mw_charged_blade": "Charged Blade", "npcf_claws_monstrosity": "Plasma Talons", "mw_combat_drill": "DefaultMelee", "npcf_combat_knife_assault": "DefaultMelee", "npcf_combat_shotgun_sentinel": "Shotgun", "npcf_concussion_gun_spacer": "Burst Launcher", "mw_concussion_missiles": "Missile", "mw_cutter_mkii_plasma_torch": "Plasma Torch", "mw_cyclone_pulse_rifle": "Cyclone Pulse Rifle", "mw_d_d_288": "DD 288", "mw_daisy_cutter": "Shotgun", "mw_deck_sweeper_automatic_shotgun": "Shotgun", "npcf_demolition_hammer_demolisher": "Hammer", "mw_displacer": "Displacer", "npcf_drum_shotgun_goliath": "Shotgun", "npcf_dual_shotguns_breacher": "Shotgun", "nrfaw-npc_npcf_skirmisher_kit_explosive_rifle_strider": "Bolt Thrower", "mw_ferrofluid_lance": "War Pike", "npcf_flak_cannon_engineer": "Mortar", "npcf_flamethrower_pyro": "Flamethrower", "npcf_flechette_shot_breacher": "Shotgun", "mw_fold_knife": "DefaultMelee", "mw_fuel_rod_gun": "Fuel Rod Gun", "mw_fusion_rifle": "Plasma Rifle", "mw_gandiva_missiles": "Missile", "mw_ghast_nexus": "Nexus", "mw_ghoul_nexus": "Nexus", "npcf_grav_grenade_launcher_seeder": "Displacer", "npcf_graviton_lance_barricade": "Warp Rifle", "mw_gravity_gun": "Displacer", "npcf_gravity_rifle_spacer": "Warp Rifle", "mw_hammer_u_rpl": "HMG", "mw_hand_cannon": "Pistol", "npcf_harpoon_cannon_berserker": "ArcBow", "npcf_heated_blade_assassin": "DefaultMelee", "npcf_heavy_assault_rifle_assault": "Assault Rifle", "npcf_heavy_assault_shield_bastion": "DefaultMelee", "mw_heavy_charged_blade": "Charged Blade", "mw_heavy_machine_gun": "HMG", "mw_heavy_melee_weapon": "DefaultMelee", "npcf_hellfire_projector_ultra": "Annihilator", "npcf_hex_missiles_hornet": "Missile", "mw_caliban_integrated": "Shotgun", "mw_hhs_155_cannibal": "Shotgun", "mw_howitzer": "Mortar", "npcf_hunter_killer_nexus_hive": "Nexus", "mw_impact_lance": "Impact Lance", "mw_impaler_nailgun": "Bolt Thrower", "nrfaw-npc_npcf_judgement_shotgun_avenger": "Shotgun", "mw_kinetic_hammer": "Hammer", "mw_krakatoa_thermobaric_flamethrower": "Flamethrower", "mw_kraul_rifle": "Kraul Rifle", "mw_lancaster_integrated": "Latch Drone", "mw_leviathan_heavy_assault_cannon": "HMG", "npcf_light_laser_aegis": "Lasers", "npcf_light_machine_gun_archer": "HMG", "mw_raleigh_integrated": "Burst Launcher", "npcf_machine_pistol_specter": "Pistol", "nrfaw-npc_npcf_sapper_kit_mag_shotgun_strider": "Shotgun", "mw_magnetic_cannon": "Impact Lance", "mw_emperor_integrated": "ArcBow", "npcf_marker_rifle_scout": "LockOn", "npcf_melee_weapon_human": "DefaultMelee", "mw_mimic_gun": "PPC", "npcf_missile_launcher_ace": "Missile", "npcf_missile_pods_rainmaker": "Missile", "mw_missile_rack": "Missile", "npcf_missile_swarm_ace": "Missile", "npcf_monowire_sword_specter": "DefaultMelee", "mw_mortar": "Mortar", "npcf_nail_gun_berserker": "Kraul Rifle", "mw_nanobot_whip": "Nanobot Whip", "mw_nanocarbon_sword": "DefaultMelee", "npcf_napalm_bomb_pyro": "Mortar", "mw_nexus_hunter_killer": "Nexus", "mw_nexus_light": "Nexus", "npcf_nova_missiles_operator": "Missile", "mw_oracle_lmg_i": "Assault Rifle", "mw_pinaka_missiles": "Missile", "mw_pistol": "Pistol", "mw_exo_plasma_maul": "Plasma Maul", "mw_tokugawa_alt_enkidu_integrated": "Plasma Talons", "mw_plasma_thrower": "Plasma Thrower", "mw_power_knuckles": "DefaultMelee", "npcf_primary_weapon_squad": "Assault Rifle", "mw_prototype_1": "PPC", "mw_prototype_2": "PPC", "mw_prototype_3": "PPC", "npcf_pulse_laser_scourer": "Veil Rifle", "mw_rail_rifle": "Railgun", "mw_railgun": "Railgun", "npcf_ram_cannon_cataphract": "DefaultMelee", "npcf_ranged_weapon_human": "Pistol", "nrfaw-npc_npcf_marksman_kit_ranger_long_rifle_strider": "AMR", "npcf_raptor_plasma_rifle_operator": "Plasma Rifle", "npcf_ravager_turret_ultra": "HMG", "npcf_repeater_cannon_bombard": "Mortar", "mw_retort_loop": "Retort Loop", "npcf_retractable_sword_sentinel": "DefaultMelee", "nrfaw-npc_npcf_ripper_claws_lurker": "Nanobot Whip", "mw_rocket_propelled_grenade": "Missile", "npcf_rotary_grenade_launcher_bastion": "Mortar", "nrfaw-npc_npcf_scouring_whip_lurker": "Nanobot Whip", "npcf_seeker_cloud_hive": "Nexus", "mw_segment_knife": "DefaultMelee", "mw_sharanga_missiles": "Missile", "mw_shatterhead_colony_missiles": "Missile", "mw_shock_knife": "DefaultMelee", "mw_shotgun": "Shotgun", "nrfaw-npc_npcf_siege_kit_shoulder_mortar_strider": "Mortar", "mw_siege_cannon": "Mortar", "mw_slag_cannon": "Slag Cannon", "nrfaw-npc_npcf_slug_pistol_avenger": "Pistol", "mw_smartgun": "Assault Rifle", "mw_sol_pattern_laser_rifle": "Lasers", "npcf_stinger_pistol_hornet": "Pistol", "mw_stub_cannon": "HMG", "mw_swarm_hive_nanites": "Nexus", "mw_tachyon_lance": "Tachyon Lance", "mw_tactical_knife": "DefaultMelee", "mw_tactical_melee_weapon": "DefaultMelee", "mw_terashima_blade": "DefaultMelee", "mw_thermal_lance": "Thermal Rifle", "npcf_thermal_lance_scourer": "Thermal Rifle", "mw_thermal_pistol": "Thermal Rifle", "mw_thermal_rifle": "Thermal Rifle", "mw_xiaoli_combat_sheathe": "DefaultMelee", "mw_torch": "Torch", "npcf_underslung_grenade_launcher_assault": "Mortar", "mw_unraveler": "Retort Loop", "mw_variable_sword": "DefaultMelee", "mw_veil_rifle": "Veil Rifle", "mw_vijaya_rockets": "Missile", "mw_vorpal_gun": "Retort Loop", "mw_vulture_dmr": "AMR", "mw_war_pike": "War Pike", "mw_warp_rifle": "Warp Rifle", "mw_sherman_integrated": "Railgun"};

// Every time a chat message is posted...
Hooks.on("createChatMessage", (data) => {
        // output the chat message data to console for easy reading
        if(game.user.id !== data.user.id) return
        let chatMessageDataContent = data.data.content ?? '';
        console.log(chatMessageDataContent);
        // Parse the chat message as XML so that we can navigate through it
        const parser = new DOMParser();
        const chatMessage = parser.parseFromString(chatMessageDataContent, "text/xml");
        // try to get macro details from reroll data
        // reroll data is embedded in the chat message under the reroll link in the `data-macro` attribute of the reroll <a> tag.
        // the reroll data is a JSON string that has been `encodeURIComponent`'d and then base64-encoded.
        let encodedRerollData = chatMessage.querySelectorAll("[data-macro]")?.[0].getAttribute("data-macro");
        if (!encodedRerollData) {
            return;
        }
        let rerollData = JSON.parse(decodeURIComponent(atob(encodedRerollData)));
        const sourceInfo = rerollData.args[0];
        const weaponItemId = rerollData.args[1];
        const targetTokens = rerollData.args[3].targets.map(t =>_getTokenByIdOrActorId(t.target_id));
        let sourceToken = _getTokenByIdOrActorId(sourceInfo.id);
        const weapon_lid = sourceToken.actor.items.get(weaponItemId)?.data.data.lid;
        console.log(weapon_lid);

        const macro_name = weapon_effects[weapon_lid];
        if (macro_name) {
            console.log("found macro '" + macro_name + "' for weapon '" + weapon_lid + "', playing animation");
            _executeMacroByName(macro_name, sourceToken, targetTokens);
        }
});