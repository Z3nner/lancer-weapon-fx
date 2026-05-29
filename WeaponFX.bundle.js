const MODULE_ID = "lancer-weapon-fx";

const PACK_ID_WEAPONFX = `${MODULE_ID}.weaponfx`;

const SETTING_VOLUME = "volume";
const SETTING_IS_PLAY_DEFAULT_EFFECTS_GEAR = "isPlayDefaultEffectsGear";
const SETTING_IS_PLAY_DEFAULT_EFFECTS_WEAR_AND_TEAR = "isPlayDefaultEffectsWearAndTear";
const SETTING_IS_WEAPON_HEURISTIC_ACTIVE = "isWeaponHeuristicActive";
const SETTING_IS_IGNORE_LIGHTING_COLORATION = "isIgnoreLightingColoration";
const SETTING_IS_IGNORE_FOG_OF_WAR = "isIgnoreFogOfWar";
const SETTING_EFFECTS_MANAGER_STATE = "effectsManagerState";

const SETTING_DEBUG_IS_DEFAULT_MISS = "debug-is-default-miss";

const bindHooks$4 = () => {
    // Register settings
    Hooks.on("init", () => {
        game.settings.register(MODULE_ID, SETTING_VOLUME, {
            name: "lancer-weapon-fx.Sound Volume",
            hint: "lancer-weapon-fx.Sound Volume Hint",
            scope: "world",
            config: true,
            type: Number,
            range: { min: 0, max: 2, step: 0.1 },
            default: 1.0,
        });

        game.settings.register(MODULE_ID, SETTING_IS_PLAY_DEFAULT_EFFECTS_GEAR, {
            name: "lancer-weapon-fx.Play Default Gear Effects",
            hint: "lancer-weapon-fx.Play Default Gear Effects Hint",
            scope: "world",
            config: true,
            type: Boolean,
            default: true,
        });

        game.settings.register(MODULE_ID, SETTING_IS_PLAY_DEFAULT_EFFECTS_WEAR_AND_TEAR, {
            name: "lancer-weapon-fx.Play Default Wear and Tear Effects",
            hint: "lancer-weapon-fx.Play Default Wear and Tear Effects Hint",
            scope: "world",
            config: true,
            type: Boolean,
            default: true,
        });

        game.settings.register(MODULE_ID, SETTING_IS_WEAPON_HEURISTIC_ACTIVE, {
            name: "lancer-weapon-fx.Use Weapon Heuristic",
            hint: "lancer-weapon-fx.Use Weapon Heuristic Hint",
            scope: "world",
            config: true,
            type: Boolean,
            default: true,
        });

        game.settings.register(MODULE_ID, SETTING_IS_IGNORE_FOG_OF_WAR, {
            name: "lancer-weapon-fx.Ignore Fog of War",
            hint: "lancer-weapon-fx.Ignore Fog of War Hint",
            scope: "world",
            config: true,
            type: Boolean,
            default: true,
        });

        game.settings.register(MODULE_ID, SETTING_IS_IGNORE_LIGHTING_COLORATION, {
            name: "lancer-weapon-fx.Ignore Lighting Coloration",
            hint: "lancer-weapon-fx.Ignore Lighting Coloration Hint",
            scope: "world",
            config: true,
            type: Boolean,
            default: false,
        });

        game.settings.register(MODULE_ID, SETTING_DEBUG_IS_DEFAULT_MISS, {
            name: "lancer-weapon-fx.Debug: Play Miss Animations by Default",
            scope: "client",
            config: true,
            type: Boolean,
            default: false,
        });
    });
};

function euclideanDistance(point1, point2) {
    // Calculate the Euclidean distance between two points.
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Quickly shuffle an array in-place.
 */
function fisherYatesShuffle(array) {
    for (let i = array.length - 1; i > 0; --i) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getUniquePoints(points) {
    const getPointId = point => `${point.x},${point.y}`;

    const seen = new Set();
    return points.filter(point => {
        const id = getPointId(point);
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
    });
}

function getMacroVariables(macro = null, token = null) {
    const sourceTokenFallback = token ?? canvas.tokens.controlled[0] ?? game.combat?.current?.tokenId;
    const targetsFallback = [...game.user.targets];
    const flowInfo = macro?.flags?.[MODULE_ID]?.flowInfo;

    if (!flowInfo) {
        return {
            sourceToken: sourceTokenFallback,
            targetTokens: targetsFallback,
            targetsMissed: game.settings.get(MODULE_ID, SETTING_DEBUG_IS_DEFAULT_MISS)
                ? new Set(targetsFallback.map(target => target.id))
                : new Set(),
        };
    }

    const { sourceToken, targetTokens, targetsMissed } = flowInfo;
    return {
        sourceToken: sourceToken || sourceTokenFallback,
        targetTokens: targetTokens && targetTokens.length > 0 ? targetTokens : targetsFallback,
        targetsMissed: targetsMissed || new Set(),
    };
}

function getSearchString(str) {
    return (str || "").toLowerCase().trim();
}

class LloydsAlgorithm {
    static _assignToClusters(points, centroids) {
        const clusters = Array.from(centroids, () => []);

        for (const point of points) {
            const distances = centroids.map(centroid => euclideanDistance(point, centroid));
            const clusterIndex = distances.indexOf(Math.min(...distances));
            clusters[clusterIndex].push(point);
        }

        return clusters;
    }

    static _calculateCentroids(cluster) {
        // Calculate the centroid (mean) of a cluster of points.
        if (cluster.length === 0) {
            return null;
        }

        const sumX = cluster.reduce((sum, point) => sum + point.x, 0);
        const sumY = cluster.reduce((sum, point) => sum + point.y, 0);

        return { x: sumX / cluster.length, y: sumY / cluster.length };
    }

    static getCentroids(points, numCentroids) {
        if (numCentroids <= 0) {
            return [];
        }

        // If we request more centroids than there are points, each point must be its own centroid
        if (points.length <= numCentroids) {
            return points;
        }

        // Initialize random centroids to start the algorithm.
        // Ensure each seed centroid is unique.
        const uniquePoints = getUniquePoints(points);
        const centroids = fisherYatesShuffle(uniquePoints.slice()).slice(0, numCentroids);
        if (centroids.length < numCentroids) {
            // If there are insufficiently many unique seed points, generate more points by adding an increasing offset
            //   to the biggest X and Y values from all points.
            const maxX = Math.max(...uniquePoints.map(({ x }) => x));
            const maxY = Math.max(...uniquePoints.map(({ y }) => y));

            for (let i = centroids.length; i < numCentroids; ++i) {
                centroids.push({ x: maxX + i, y: maxY + i });
            }
        }

        let previousCentroids;
        while (
            !previousCentroids ||
            !centroids.every(
                (centroid, i) => centroid.x === previousCentroids[i].x && centroid.y === previousCentroids[i].y,
            )
        ) {
            previousCentroids = centroids.slice();

            // Assign points to clusters based on the current centroids.
            const clusters = this._assignToClusters(points, centroids);

            // Calculate new centroids based on the current cluster assignments.
            centroids.forEach((_, i) => {
                centroids[i] = this._calculateCentroids(clusters[i]);
            });
        }

        return centroids;
    }
}

/**
 * Functions exposed by the module for use in macros.
 */
class ModuleApi {
    static getEffectVolume(volume) {
        return volume * game.settings.get(MODULE_ID, SETTING_VOLUME);
    }

    static isEffectIgnoreLightingColoration() {
        return !!game.settings.get(MODULE_ID, SETTING_IS_IGNORE_LIGHTING_COLORATION);
    }

    static isEffectIgnoreFogOfWar() {
        return !!game.settings.get(MODULE_ID, SETTING_IS_IGNORE_FOG_OF_WAR);
    }

    static getTargetLocationsFromTokenGroup(targetTokens, numGroups) {
        const targetPoints = targetTokens.map(token => {
            return { x: token.center.x, y: token.center.y };
        });

        return LloydsAlgorithm.getCentroids(targetPoints, numGroups);
    }

    static getSequencerPathVariant(partialSequencerPath) {
        const pathsUnder = Sequencer.Database.getPathsUnder(partialSequencerPath);
        return [partialSequencerPath, pathsUnder[Math.round((pathsUnder.length - 1) * Math.random())]].join(".");
    }

    static getMacroVariables = getMacroVariables;
    static euclideanDistance = euclideanDistance;
}

const bindHooks$3 = () => {
    Hooks.on("init", () => (game.modules.get(MODULE_ID).api = ModuleApi));
};

const bindHooks$2 = () => {
    Hooks.once("sequencer.ready", () => {
        // Check if either free or Patreon JB2A module is installed and activated, otherwise return and display an error message.
        if (game.modules.get("jb2a_patreon")?.active || game.modules.get("JB2A_DnD5e")?.active) return;

        const message =
            "Lancer Weapon FX | You need either the Free or the Patreon version of JB2A installed and active for this module to work properly!";
        console.error(`${message} The free version can be found at: https://foundryvtt.com/packages/JB2A_DnD5e`);
        ui.notifications.error(message, { permanent: true, console: false });
    });
};

class FlowInfo {
    constructor({ sourceToken, macroUuid, targetTokens = null, targetsMissed = new Set() }) {
        this.sourceToken = sourceToken;
        this.macroUuid = macroUuid;
        this.targetTokens = targetTokens;
        this.targetsMissed = targetsMissed;
    }
}

function getTokenByIdOrActorId(id) {
    let token = canvas.tokens.get(id);
    if (!token) {
        token = canvas.tokens.ownedTokens.filter(t => t.actor.id === id)?.[0];
        if (!token) {
            console.log(`Lancer Weapon FX | No token with id '${id}' found.`);
            return null;
        }
    }
    return token;
}

async function processFlowInfo(flowInfo) {
    const { macroUuid, sourceToken } = flowInfo;
    if (macroUuid == null) return;

    const macro = await fromUuid(macroUuid);
    if (!macro) {
        console.error(`Lancer Weapon FX | Could not load macro "${macroUuid}"!`);
        return;
    }

    const temp_macro = new Macro(macro.toObject());

    (temp_macro.flags[MODULE_ID] ||= {}).flowInfo = flowInfo;
    temp_macro.ownership.default = CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER;

    temp_macro.execute({ actor: sourceToken?.actor, token: sourceToken });
}

const EFFECTS_WEAR_AND_TEAR = {
    "lwfx_overcharge": "Overcharge",
    "lwfx_overheat_critical_reactor_failure": "Critical Reactor Failure",
    "lwfx_overheat_destabilized_power_plant": "Destabilized Power Plant",
    "lwfx_overheat_emergency_shunt": "Emergency Shunt",
    "lwfx_overheat_irreversible_meltdown": "Irreversible Meltdown",
    "lwfx_overheat_meltdown_3": "Meltdown",
    "lwfx_overheat_meltdown_2": "Meltdown",
    "lwfx_overheat_meltdown_1": "Meltdown",
    "lwfx_overheat_power_failure": "Power Failure",
    "lwfx_stabilize": "Stabilize",
    "lwfx_structure_glancing_blow": "Glancing Blow",
    "lwfx_structure_system_trauma": "Pre System Trauma",
    "lwfx_structure_secondary": "System Trauma",
    "lwfx_structure_direct_hit_3": "Direct Hit 2",
    "lwfx_structure_direct_hit_2": "Direct Hit 2",
    "lwfx_structure_direct_hit_1": "Direct Hit 1",
    "lwfx_structure_crushing_hit": "Crushing Hit",

    // Monstrosity "UNIQUE PHYSIOLOGY" table
    // TODO(Future) implement!
    // "lwfx_monstrosity_fatal": "Monstrosity Fatal Hit",
    // "lwfx_monstrosity_direct_hit_3": "Monstrosity Direct Hit 2",
    // "lwfx_monstrosity_direct_hit_2": "Monstrosity Direct Hit 2",
    // "lwfx_monstrosity_direct_hit_1": "Monstrosity Direct Hit 1",
    // "lwfx_monstrosity_dismember": "Monstrosity Dismemberment",
    // "lwfx_monstrosity_powerful_hit": "Monstrosity Powerful Hit",
    // "lwfx_monstrosity_glancing_hit": "Monstrosity Glancing Hit",
};

const EFFECTS_GEAR = {
    //NON-ITEM EFFECTS
    "default_tech_attack": "DefaultTech",
    "lwfx_default_melee": "DefaultMelee",
    "lwfx_default_ranged": "Pistol",

    //CORE, LONG RIM, WALLFLOWER, KTB
    "mw_andromeda_pattern_heavy_laser_rifle": "Lasers",
    "mw_annihilation_nexus": "Nexus",
    "mw_annihilator": "Annihilator",
    "mw_anti_materiel_rifle": "AMR",
    "mw_arc_projector": "PPC",
    "mw_assault_cannon": "HMG",
    "mw_assault_rifle": "Assault Rifle",
    "mw_autogun": "Assault Rifle",
    "mw_autopod": "AutoPod",
    "mw_barbarossa_integrated": "Apocalypse Rail",
    "mw_blackspot_targeting_laser": "LockOn",
    "mw_bolt_nexus": "Nexus",
    "mw_bolt_thrower": "Bolt Thrower",
    "mw_bristlecrown_flechette_launcher": "Flechette Launcher",
    "mw_burst_launcher": "Burst Launcher",
    "mw_caliban_integrated": "Shotgun",
    "mw_catalyst_pistol": "Plasma Rifle",
    "mw_catalytic_hammer": "DefaultMelee",
    "mw_chain_axe": "DefaultMelee",
    "mw_charged_blade": "Charged Blade",
    "mw_combat_drill": "Combat Drill",
    "mw_concussion_missiles": "Missile",
    "mw_cutter_mkii_plasma_torch": "Plasma Torch",
    "mw_cyclone_pulse_rifle": "Cyclone Pulse Rifle",
    "mw_d_d_288": "DD 288",
    "mw_daisy_cutter": "Shotgun",
    "mw_deck_sweeper_automatic_shotgun": "Shotgun",
    "mw_displacer": "Displacer",
    "mw_emperor_integrated": "ArcBow",
    "mw_exo_brood_siblings_molt": "Brood Siblings Molt",
    "mw_exo_plasma_maul": "Plasma Maul",
    "mw_exo_steelpunch_heavy_needlebeam": "Needle Beam",
    "mw_exo_sting_heavy_anti_armor_rifle": "AMR",
    "mw_ferrofluid_lance": "War Pike",
    "mw_fold_knife": "DefaultMelee",
    "mw_fuel_rod_gun": "Fuel Rod Gun",
    "mw_fusion_rifle": "Plasma Rifle",
    "mw_gandiva_missiles": "Missile",
    "mw_ghast_nexus": "Nexus",
    "mw_ghoul_nexus": "Nexus",
    "mw_gravity_gun": "Displacer",
    "mw_hammer_u_rpl": "HMG",
    "mw_hand_cannon": "Pistol",
    "mw_heavy_charged_blade": "Charged Blade",
    "mw_heavy_machine_gun": "HMG",
    "mw_heavy_melee_weapon": "DefaultMelee",
    "mw_hhs_155_cannibal": "Shotgun",
    "mw_howitzer": "Mortar",
    "mw_impact_lance": "Impact Lance",
    "mw_impaler_nailgun": "Bolt Thrower",
    "mw_kinetic_hammer": "Hammer",
    "mw_krakatoa_thermobaric_flamethrower": "Flamethrower",
    "mw_kraul_rifle": "Kraul Rifle",
    "mw_lancaster_integrated": "Latch Drone",
    "mw_leviathan_heavy_assault_cannon": "Leviathan",
    "mw_magnetic_cannon": "Impact Lance",
    "mw_mimic_gun": "PPC",
    "mw_missile_rack": "Missile",
    "mw_mortar": "Mortar",
    "mw_nanobot_whip": "Nanobot Whip",
    "mw_nanocarbon_sword": "DefaultMelee",
    "mw_nexus_hunter_killer": "Nexus",
    "mw_nexus_light": "Nexus",
    "mw_oracle_lmg_i": "Assault Rifle",
    "mw_pinaka_missiles": "MissilePinaka",
    "mw_pistol": "Pistol",
    "mw_plasma_thrower": "Plasma Thrower",
    "mw_power_knuckles": "DefaultMelee",
    "mw_prototype_1": "PPC",
    "mw_prototype_2": "PPC",
    "mw_prototype_3": "PPC",
    "mw_rail_rifle": "Railgun",
    "mw_railgun": "Railgun",
    "mw_raleigh_integrated": "Burst Launcher",
    "mw_retort_loop": "Retort Loop",
    "mw_rocket_propelled_grenade": "Missile",
    "mw_segment_knife": "DefaultMelee",
    "mw_sharanga_missiles": "Missiles",
    "mw_shatterhead_colony_missiles": "Missile",
    "mw_sherman_integrated": "Railgun",
    "mw_shock_knife": "DefaultMelee",
    "mw_shotgun": "Shotgun",
    "mw_siege_cannon": "Mortar",
    "mw_slag_cannon": "Slag Cannon",
    "mw_smartgun": "Assault Rifle",
    "mw_sol_pattern_laser_rifle": "Lasers",
    "mw_stub_cannon": "HMG",
    "mw_swarm_hive_nanites": "Nexus",
    "mw_tachyon_lance": "Tachyon Lance",
    "mw_tactical_knife": "DefaultMelee",
    "mw_tactical_melee_weapon": "DefaultMelee",
    "mw_terashima_blade": "DefaultMelee",
    "mw_thermal_lance": "Thermal Rifle",
    "mw_thermal_pistol": "Thermal Rifle",
    "mw_thermal_rifle": "Thermal Rifle",
    "mw_tokugawa_alt_enkidu_integrated": "Plasma Talons",
    "mw_torch": "Torch",
    "mw_unraveler": "Retort Loop",
    "mw_variable_sword": "DefaultMelee",
    "mw_veil_rifle": "Veil Rifle",
    "mw_vijaya_rockets": "Missile",
    "mw_vorpal_gun": "Retort Loop",
    "mw_vulture_dmr": "BattleRifle",
    "mw_war_pike": "War Pike",
    "mw_warp_rifle": "Warp Rifle",
    "mw_xiaoli_combat_sheathe": "DefaultMelee",
    "npcf_acid_spittle_monstrosity": "Nanobot Whip",
    "npcf_anti_armor_weapon_human": "AMR",
    "npcf_anti_armor_weapon_squad": "AMR",
    "npcf_anti_materiel_rifle_sniper": "AMR",
    "npcf_boarding_leash_pirate": "DefaultMelee",
    "npcf_bombard_cannon_bombard": "Apocalypse Rail",
    "npcf_carbon_fiber_sword_ronin": "DefaultMelee",
    "npcf_chain_axe_berserker": "DefaultMelee",
    "npcf_claws_monstrosity": "Plasma Talons",
    "npcf_combat_knife_assault": "DefaultMelee",
    "npcf_combat_shotgun_sentinel": "Shotgun",
    "npcf_concussion_gun_spacer": "Burst Launcher",
    "npcf_demolition_hammer_demolisher": "Hammer",
    "npcf_devils_cough_shotgun_assassin": "Shotgun",
    "npcf_drum_shotgun_goliath": "Shotgun",
    "npcf_dual_shotguns_breacher": "Shotgun",
    "npcf_flak_cannon_engineer": "Mortar",
    "npcf_flamethrower_pyro": "Flamethrower",
    "npcf_flechette_shot_breacher": "Shotgun",
    "npcf_grav_grenade_launcher_seeder": "Displacer",
    "npcf_graviton_lance_barricade": "Warp Rifle",
    "npcf_gravity_rifle_spacer": "Warp Rifle",
    "npcf_harpoon_cannon_berserker": "ArcBow",
    "npcf_heated_blade_assassin": "DefaultMelee",
    "npcf_heavy_assault_rifle_assault": "Assault Rifle",
    "npcf_heavy_assault_shield_bastion": "DefaultMelee",
    "npcf_hellfire_projector_ultra": "Annihilator",
    "npcf_hex_missiles_hornet": "Missile",
    "npcf_hunter_killer_nexus_hive": "Nexus",
    "npcf_light_laser_aegis": "Lasers",
    "npcf_light_machine_gun_archer": "HMG",
    "npcf_machine_pistol_specter": "Pistol",
    "npcf_marker_rifle_scout": "LockOn",
    "npcf_melee_weapon_human": "DefaultMelee",
    "npcf_missile_launcher_ace": "Missile",
    "npcf_missile_pods_rainmaker": "Missiles",
    "npcf_missile_swarm_ace": "Missiles",
    "npcf_monowire_sword_specter": "DefaultMelee",
    "npcf_nail_gun_berserker": "Kraul Rifle",
    "npcf_napalm_bomb_pyro": "Mortar",
    "npcf_nova_missiles_operator": "Missile",
    "npcf_primary_weapon_squad": "Assault Rifle",
    "npcf_pulse_laser_scourer": "Veil Rifle",
    "npcf_ram_cannon_cataphract": "DefaultMelee",
    "npcf_ranged_weapon_human": "Pistol",
    "npcf_raptor_plasma_rifle_operator": "Plasma Rifle",
    "npcf_ravager_turret_ultra": "HMG",
    "npcf_repeater_cannon_bombard": "Mortar",
    "npcf_retractable_sword_sentinel": "DefaultMelee",
    "npcf_rotary_grenade_launcher_bastion": "Mortar",
    "npcf_seeker_cloud_hive": "Nexus",
    "npcf_stinger_pistol_hornet": "Pistol",
    "npcf_thermal_lance_scourer": "Thermal Rifle",
    "npcf_underslung_grenade_launcher_assault": "Mortar",
    "nrfaw-npc_npcf_judgement_shotgun_avenger": "Shotgun",
    "nrfaw-npc_npcf_marksman_kit_ranger_long_rifle_strider": "AMR",
    "nrfaw-npc_npcf_ripper_claws_lurker": "Nanobot Whip",
    "nrfaw-npc_npcf_sapper_kit_mag_shotgun_strider": "Shotgun",
    "nrfaw-npc_npcf_scouring_whip_lurker": "Nanobot Whip",
    "nrfaw-npc_npcf_siege_kit_shoulder_mortar_strider": "Mortar",
    "nrfaw-npc_npcf_skirmisher_kit_explosive_rifle_strider": "Bolt Thrower",
    "nrfaw-npc_npcf_slug_pistol_avenger": "Pistol",

    // LANCER PORTUGUESE BASIC NPCS (lancer-npcs-basico)
    "feature_acid_spit": "Nanobot Whip",
    "feature_claws": "Plasma Talons",
    "feature_fuzil_antimaterial": "AMR",
    "feature_espada_de_fibra_de_carbono": "DefaultMelee",
    "feature_fuzil_de_assalto_pesado": "Assault Rifle",
    "feature_faca_de_combate": "DefaultMelee",
    "feature_lan_ador_de": "Mortar",
    "feature_lanca_de_graviton": "Warp Rifle",
    "feature_escudo_de_assalto_pesado": "DefaultMelee",
    "feature_machado_serra": "DefaultMelee",
    "feature_canhao_de_arpao": "ArcBow",
    "feature_canhao_de_bombarda": "Apocalypse Rail",
    "feature_espingardas_duplas": "Shotgun",
    "feature_disparo_de_flechete": "Shotgun",
    "feature_canhao_de_investida": "DefaultMelee",
    "feature_martelo_de_demolicao": "Hammer",
    "feature_canhao_antiao_reo": "Mortar",
    "feature_escopeta_de_tambor": "Shotgun",
    "feature_nexo_ca_ador_assassino": "Nexus",
    "feature_enxame_direcionado": "Nexus",
    "feature_pistola_ferrao": "Pistol",
    "feature_misseis_hex": "Missile",
    "feature_fuzil_de_plasma_raptor": "Plasma Rifle",
    "feature_misseis_nova": "Missile",
    "feature_lanca_chamas": "Flamethrower",
    "feature_bomba_de_napalm": "Mortar",
    "feature_lan_ador_de_misseis": "Missile",
    "feature_enxame_de_misseis": "Missiles",
    "feature_barragem_de_micromisseis": "Missiles",
    "feature_laser_leve": "Lasers",
    "feature_metralhadora_leve": "HMG",
    "feature_pistola_automatica": "Pistol",
    "feature_espada_monofio": "DefaultMelee",
    "feature_fuzil_marcador": "LockOn",
    "feature_arma_de_prego": "Kraul Rifle",
    "feature_lanca_termica": "Thermal Rifle",
    "feature_laser_de_pulso": "Veil Rifle",
    "feature_espingarda_de_combate": "Shotgun",
    "feature_espada_retratil": "DefaultMelee",
    "feature_arpao_gravitacional": "Warp Rifle",
    "feature_arpao_detonador": "ArcBow",
    "feature_canhao_repetidor": "Mortar",
    "feature_arma_selante": "DefaultMelee",

    //SOLSTICE RAIN
    "mw_xc_br_battle_rifle": "BattleRifle",
    "mw_xc_dpm_predator_nexus": "Nexus",

    //WINTER SCAR
    "mw_shrapnel_cannon": "Shrapnel Cannon",
    "mw_fusion_torch": "Plasma Torch",
    "mw_superthermal_blade": "Charged Blade",
    "mw_integrated_shock_claws": "Shock Claws",
    "npc_mbt_smoothbore_cannon": "Apocalypse Rail",
    "npc_mbt_railgun": "Railgun",
    "npc_mbt_antares-pattern_laser_cannon": "Lasers",
    "npc_mbt_anti-tank_gun": "Apocalypse Rail",
    "npc_mbt_streetsweeper_canister_projector": "CannonAirburst",
    "npc_mbt_pintle-mounted_machine_gun": "HMG",
    "npc_mbt_anti-armor_missiles": "Missile",
    "npc_mbt_marker_nexus": "Nexus",
    "npc_mbt_skylight_anti-air_laser": "Lasers",
    "npc_mbt_multi-directional_charges": "Flechette Launcher",

    //DUSTGRAVE
    "mw_blast_pick": "BlastPick",
    "mw_brutus_shield": "DefaultMelee",
    "mw_brutus_wrecker": "DefaultMelee",
    "mw_hurricane_cluster_projector": "CannonAirburst",
    "mw_reaper_assault_cannon": "Leviathan",
    "mw_shock_baton": "ShockBaton",
    "mw_tempest_charged_blade": "TempestBlade",

    //DUSTGRAVE NPCs
    "npcf_assimilaiton_maw_horror": "AssimilationMaw",
    "npcf_buzzsaw_industrial_mech": "DefaultMelee",
    "npcf_disruptor_whip_horror": "DisruptorWhip",
    "npcf_fusion_cutter_industrial_mech": "Plasma Torch",
    "npcf_gyrojet_cannon_spec_op": "Missile",
    "npcf_industrial_clamps_industrial_mech": "DefaultMelee",
    "npcf_rivet_cannon_industrial_mech": "Bolt Thrower",
    "npcf_rock_drill_industrial_mech": "Combat Drill",
    "npcf_serrated_machete_spec_op": "DefaultMelee",
    "npcf_wrecker_industrial_mech": "DefaultMelee",

    //SIRENS SONG
    "npc_Leech_PairedTalonsMKII": "Plasma Talons",
    "npc_PDCTurret": "Leviathan",
    "npc_Tempest_NaniteMonsoonDispensers": "Nexus",
    "npc_Tempest_TyphoonNaniteCannon": "Nexus",

    //NPC REBAKE
    "npc-rebake_npcf_missile_launcher_ace": "Missile",
    "npc-rebake_npcf_missile_swarm_ace": "Missiles",
    "npc-rebake_npcf_light_laser_aegis": "Lasers",
    "npc-rebake_npcf_light_machine_gun_archer": "HMG",
    "npc-rebake_npcf_heated_blade_assassin": "DefaultMelee",
    "npc-rebake_npcf_devils_cough_shotgun_assassin": "Shotgun",
    "npc-rebake_npcf_weapon_heavy_assault": "Assault Rifle",
    "npc-rebake_npcf_weapon_combat_knife": "DefaultMelee",
    "npc-rebake_npcf_weapon_underslung_grenade": "Mortar",
    "npc-rebake_npcf_graviton_lance_barricade": "Warp Rifle",
    "npc-rebake_npcf_rotary_grenade_launcher_bastion": "Mortar",
    "npc-rebake_npcf_heavy_assault_shield_bastion": "DefaultMelee",
    "npc-rebake_npcf_chain_axe_berserker": "DefaultMelee",
    "npc-rebake_npcf_harpoon_cannon_berserker": "ArcBow",
    "npc-rebake_npcf_bombard_cannon_bombard": "Apocalypse Rail",
    "npc-rebake_npcf_dual_shotguns_breacher": "Shotgun",
    "npc-rebake_npcf_ram_cannon_cataphract": "DefaultMelee",
    "npc-rebake_npcf_demolition_hammer_demolisher": "Hammer",
    "npc-rebake_npcf_earthshatter_demolisher": "Hammer",
    "npc-rebake_npcf_flak_cannon_engineer": "Mortar",
    "npc-rebake_npcf_drum_shotgun_goliath": "Shotgun",
    "npc-rebake_npcf_hunter_killer_nexus_hive": "Nexus",
    "npc-rebake_npcf_stinger_pistol_hornet": "Pistol",
    "npc-rebake_npcf_raptor_plasma_rifle_operator": "Plasma Rifle",
    "npc-rebake_npcf_flamethrower_pyro": "Flamethrower",
    "npc-rebake_npcf_missile_pods_rainmaker": "Missiles",
    "npc-rebake_npcf_carbon_fiber_sword_ronin": "DefaultMelee",
    "npc-rebake_npcf_thermal_lance_scourer": "Thermal Rifle",
    "npc-rebake_npcf_marker_rifle_scout": "LockOn",
    "npc-rebake_npcf_grav_grenade_launcher_seeder": "Displacer",
    "npc-rebake_npcf_combat_shotgun_sentinel": "Shotgun",
    "npc-rebake_npcf_retractable_sword_sentinel": "DefaultMelee",
    "npc-rebake_npcf_anti_materiel_rifle_sniper": "AMR",
    "npc-rebake_npcf_monowire_sword_specter": "DefaultMelee",
    "npc-rebake_npcf_machine_pistol_specter": "Pistol",
    "npc-rebake_npcf_dmr_artillery_grunt": "AMR",
    "npc-rebake_npcf_shoulder_mortar_artillery_grunt": "Mortar",
    "npc-rebake_npcf_survival_pistol_artillery_grunt": "Pistol",
    "npc-rebake_npcf_shotgun_defender_grunt": "Shotgun",
    "npc-rebake_npcf_assault_rifle_striker_grunt": "Assault Rifle",
    "npc-rebake_npcf_heavy_blade_striker_grunt": "DefaultMelee",
    "npc-rebake_npcf_hellfire_projector_ultra": "Annihilator",
    "npc-rebake_npcf_hyperdense_blade_ultra": "DefaultMelee",
    "npc-rebake_npcf_miniaturized_railgun_ultra": "Railgun",
    "npc-rebake_npcf_nova_missiles_ultra": "Missiles",
    "npc-rebake_npcf_ravager_turret_ultra": "HMG",
    "npc-rebake_npcf_wraith_nexus_ultra": "Nexus",
    "nrfaw-npc-rebake_npcf_judgement_shotgun_avenger": "Shotgun",
    "nrfaw-npc-rebake_npcf_scouring_whip_lurker": "Nanobot Whip",
    "nrfaw-npc-rebake_npcf_slug_pistol_avenger": "Pistol",
    "nrfaw-npc-rebake_npcf_marksman_kit_ranger_long_rifle_strider": "AMR",
    "nrfaw-npc-rebake_npcf_skirmisher_kit_explosive_carbine_strider": "Bolt Thrower",
    "nrfaw-npc-rebake_npcf_survival_knife_strider": "DefaultMelee",

    //HEURISTICS
    "lwfx_heuristic_melee": "DefaultMelee",
    "lwfx_heuristic_cqb_energy": "PPC",
    "lwfx_heuristic_cqb_shotgun": "Shotgun",
    "lwfx_heuristic_cqb_other": "Pistol",
    "lwfx_heuristic_cannon_energy": "Tachyon Lance",
    "lwfx_heuristic_cannon_mg": "HMG",
    "lwfx_heuristic_cannon_other": "Mortar",
    "lwfx_heuristic_launcher": "Missile",
    "lwfx_heuristic_nexus": "Nexus",
    "lwfx_heuristic_rifle_energy": "Thermal Rifle",
    "lwfx_heuristic_rifle_mg": "HMG",
    "lwfx_heuristic_rifle_ar": "Assault Rifle",
    "lwfx_heuristic_rifle_other": "AMR",
};

const _TYPE_STRONG = "strong";
const _TYPE_WEAK = "weak";
const _TYPE_NONE = "none";

// Prefer effects with folders, as we want effects with actors (which are stored at the folder level)
//   to take precedent over generic effects.
const _sortCustomEffects = (effectA, effectB) => Number(!!effectB.folderId) - Number(!!effectA.folderId);

const _getEffectActorUuidMatchType = ({ actorUuid, effect, customState }) => {
    if (actorUuid == null || effect.folderId == null) return _TYPE_WEAK;

    const effectActorUuid = customState.folders[effect.folderId]?.actorUuid;
    if (effectActorUuid == null) return _TYPE_WEAK;

    if (effectActorUuid === actorUuid) return _TYPE_STRONG;

    return _TYPE_NONE;
};

const _getActorSpecificCandidateEffects = ({ actorUuid, customState, candidateEffects }) => {
    const typed = {};

    candidateEffects.forEach(effect => {
        (typed[_getEffectActorUuidMatchType({ actorUuid, effect, customState })] ||= []).push(effect);
    });

    if (typed[_TYPE_STRONG]?.length) return typed[_TYPE_STRONG];
    if (typed[_TYPE_WEAK]?.length) return typed[_TYPE_WEAK];
    return [];
};

const _getCustomMacroUuidByItemLid = ({ actorUuid, itemLid, customState }) => {
    const itemLidSearch = getSearchString(itemLid);
    if (!itemLidSearch) return null;

    const candidateEffects = Object.values(customState.effects)
        .sort(_sortCustomEffects)
        // `.filter` instead of `.find` so we can warn if multiple matches
        .filter(effect => getSearchString(effect.itemLid) === itemLidSearch && getSearchString(effect.macroUuid));

    const byLid = _getActorSpecificCandidateEffects({
        actorUuid,
        customState,
        candidateEffects,
    });

    if (!byLid.length) return null;

    const [{ macroUuid }] = byLid;
    if (byLid.length === 1) return macroUuid;

    ui.notifications.warn(`Multiple custom effects found for Lancer ID "${itemLid}"!`);

    return macroUuid;
};

const _getCustomMacroUuidByItemName = ({ actorUuid, itemName, customState }) => {
    const itemNameSearch = getSearchString(itemName);
    if (!itemNameSearch) return null;

    const candidateEffects = Object.values(customState.effects)
        .sort(_sortCustomEffects)
        // `.filter` instead of `.find` so we can warn if multiple matches
        .filter(effect => getSearchString(effect.itemName) === itemNameSearch && getSearchString(effect.macroUuid));

    const byName = _getActorSpecificCandidateEffects({
        actorUuid,
        customState,
        candidateEffects,
    });

    if (!byName.length) return null;

    const [{ macroUuid }] = byName;
    if (byName.length === 1) return macroUuid;

    ui.notifications.warn(`Multiple custom effects found for Item Name "${itemName}"!`);

    return macroUuid;
};

const getCustomMacroUuid = ({ actorUuid, itemLid, itemName = null }) => {
    const customState = game.settings.get(MODULE_ID, SETTING_EFFECTS_MANAGER_STATE);
    if (!Object.keys(customState?.effects || {}).length) return null;

    // Resolve by name first. This allows the name of a renamed item to take precedence over its user-invisible LID.
    const byName = _getCustomMacroUuidByItemName({ actorUuid, itemName, customState });
    if (byName) return byName;

    const byLid = _getCustomMacroUuidByItemLid({ actorUuid, itemLid, customState });
    if (byLid) return byLid;

    return null;
};

/* -------------------------------------------- */

const _pGetLwfxMacroUuid = async macroName => {
    if (!macroName) return null;

    const pack = game.packs.get(PACK_ID_WEAPONFX);
    if (!pack) {
        ui.notifications.error(`Lancer Weapon FX | Compendium ${PACK_ID_WEAPONFX} not found`);
        return null;
    }

    // Case- and whitespace-insensitive search
    const macroSearchName = getSearchString(macroName);
    const macro = (await pack.getDocuments()).find(doc => getSearchString(doc.name) === macroSearchName);

    if (!macro) {
        ui.notifications.error(`Lancer Weapon FX | Macro ${macroName} not found`);
        return null;
    }

    return macro.uuid;
};

/* -------------------------------------------- */

const pGetMacroUuid = async ({ actorUuid, itemLid, itemName, fallbackActionIdentifier }) => {
    // Resolve custom macros first, to allow the user to override the module defaults
    const customUuid = await getCustomMacroUuid({ actorUuid, itemLid, itemName });
    if (customUuid) {
        console.log(
            `Lancer Weapon FX | Found custom macro "${customUuid}" for Lancer ID "${itemLid}"/Item Name "${itemName}"`,
        );
        return customUuid;
    }

    const effectLookups = [
        game.settings.get(MODULE_ID, SETTING_IS_PLAY_DEFAULT_EFFECTS_GEAR) ? EFFECTS_GEAR : null,
        game.settings.get(MODULE_ID, SETTING_IS_PLAY_DEFAULT_EFFECTS_WEAR_AND_TEAR) ? EFFECTS_WEAR_AND_TEAR : null,
    ].filter(Boolean);

    // Resolve specific effects defined by the module
    for (const effectLookup of effectLookups) {
        const lwfxUuid = await _pGetLwfxMacroUuid(effectLookup[itemLid]);
        if (lwfxUuid) {
            console.log(`Lancer Weapon FX | Found macro "${lwfxUuid}" for Lancer ID "${itemLid}"`);
            return lwfxUuid;
        }
    }

    // Resolve custom macros bound on fallback "fake LID"s
    const customFallbackUuid = await getCustomMacroUuid({ actorUuid, itemLid: fallbackActionIdentifier });
    if (customFallbackUuid) {
        console.log(
            `Lancer Weapon FX | Found custom macro "${customFallbackUuid}" for fallback identifier "${fallbackActionIdentifier}"`,
        );
        return customFallbackUuid;
    }

    // Resolve fallback effects defined by the module
    for (const effectLookup of effectLookups) {
        const lwfxFallbackUuid = await _pGetLwfxMacroUuid(effectLookup[fallbackActionIdentifier]);
        if (lwfxFallbackUuid) {
            console.log(
                `Lancer Weapon FX | Found macro "${lwfxFallbackUuid}" for fallback identifier "${fallbackActionIdentifier}"`,
            );
            return lwfxFallbackUuid;
        }
    }

    console.log(
        `Lancer Weapon FX | Did not find macro for identifier "${itemLid}" with fallback "${fallbackActionIdentifier}"`,
    );

    return null;
};

const isMachineGun = ({ name }) => {
    return /\b(?:assault|lmg|hmg|machine gun|minigun)\b/i.test(name);
};

/** @abstract */
class _Heuristic {
    constructor(flow) {
        this._flow = flow;
    }

    /** @abstract */
    _isValidFlow() {
        throw new Error();
    }
    /** @abstract */
    _getWeaponType() {
        throw new Error();
    }
    /** @abstract */
    _getPrimaryDamageType() {
        throw new Error();
    }
    /** @abstract */
    _getPrimaryRange() {
        throw new Error();
    }
    /** @abstract */
    _getSize() {
        throw new Error();
    }

    _isShotgun() {
        if (this._getPrimaryRange() === "Cone") return true;
        return /\bshotgun\b/i.test(this._flow.state.item.name);
    }

    getFallbackActionIdentifier() {
        if (!game.settings.get(MODULE_ID, SETTING_IS_WEAPON_HEURISTIC_ACTIVE)) return null;

        if (!this._isValidFlow()) return null;

        const { name } = this._flow.state.item;

        switch (this._getWeaponType()) {
            case "Melee": {
                return "lwfx_heuristic_melee";
            }

            case "CQB": {
                if (this._getPrimaryDamageType() === "Energy") return "lwfx_heuristic_cqb_energy";
                if (this._isShotgun()) return "lwfx_heuristic_cqb_shotgun";
                return "lwfx_heuristic_cqb_other";
            }

            case "Rifle": {
                if (this._getPrimaryDamageType() === "Energy") return "lwfx_heuristic_rifle_energy";
                if (isMachineGun({ name })) {
                    if (["Heavy", "Superheavy"].includes(this._getSize())) return "lwfx_heuristic_rifle_mg";
                    return "lwfx_heuristic_rifle_ar";
                }
                return "lwfx_heuristic_rifle_other";
            }

            case "Launcher": {
                return "lwfx_heuristic_launcher";
            }

            case "Cannon": {
                if (this._getPrimaryDamageType() === "Energy") return "lwfx_heuristic_cannon_energy";
                if (isMachineGun({ name })) return "lwfx_heuristic_cannon_mg";
                return "lwfx_heuristic_cannon_other";
            }

            case "Nexus": {
                return "lwfx_heuristic_nexus";
            }
        }

        return null;
    }
}

/**
 * Heuristic for player mech actor item flows.
 */
class _HeuristicMech extends _Heuristic {
    _getActiveProfile() {
        return this._flow.state.item?.system?.active_profile;
    }

    _isValidFlow() {
        return !!this._flow.state.item?.system?.active_profile;
    }

    _getWeaponType() {
        return this._getActiveProfile().type;
    }

    _getPrimaryDamageType() {
        return this._getActiveProfile().all_damage?.[0]?.type;
    }

    _getPrimaryRange() {
        return this._getActiveProfile().all_range?.[0]?.type;
    }

    _getSize() {
        return this._flow.state.item.system.size;
    }
}

/**
 * Heuristic for NPC actor item flows.
 */
class _HeuristicNpc extends _Heuristic {
    _isValidFlow() {
        return !!this._flow.state.item?.system;
    }

    static _RE_WEAPON_TYPE = /^(?<size>Superheavy|Heavy|Main|Auxiliary) /;

    _getWeaponType() {
        return (this._flow.state.item.system.weapon_type || "").replace(this.constructor._RE_WEAPON_TYPE, "");
    }

    _getPrimaryDamageType() {
        return this._flow.state.item.system.damage?.[0]?.[0]?.type;
    }

    _getPrimaryRange() {
        return this._flow.state.item.system.range?.[0]?.type;
    }

    _getSize() {
        return this.constructor._RE_WEAPON_TYPE.exec(this._flow.state.item.system.weapon_type || "")?.groups.size;
    }
}

const fallbackActionIdentifier = flow => {
    if (flow.state.item?.type === "npc_feature") return new _HeuristicNpc(flow).getFallbackActionIdentifier();
    return new _HeuristicMech(flow).getFallbackActionIdentifier();
};

/**
 * @param state
 * @param {?string} fallbackActionIdentifier Identifier used if the flow does not specify one.
 * @return {Promise<FlowInfo>}
 */
const _pGetFlowInfo = async (state, { fallbackActionIdentifier = null } = {}) => {
    const zippedTargetInfo = Array.from(
        {
            length: Math.max(state.data.acc_diff?.targets?.length || 0, state.data.hit_results?.length || 0),
        },
        (_, i) => ({
            target: state.data.acc_diff?.targets?.[i],
            hit_result: state.data.hit_results?.[i],
        }),
    );

    return new FlowInfo({
        sourceToken: getTokenByIdOrActorId(state.actor.token?.id || state.actor?.id),
        macroUuid: await pGetMacroUuid({
            // Prefer the token base actor, if available. This ensures linking for synthetic (NPC token) actors.
            actorUuid: state.actor?.token?.baseActor?.uuid || state.actor?.uuid,
            itemLid: state.item?.system?.lid,
            itemName: state.item?.name,
            fallbackActionIdentifier,
        }),
        targetTokens: zippedTargetInfo.map(({ target }) => target.target).filter(Boolean),
        targetsMissed: new Set(
            zippedTargetInfo
                .filter(({ hit_result }) => !hit_result?.hit)
                .map(({ target }) => target?.target?.id)
                .filter(Boolean),
        ),
    });
};

/* -------------------------------------------- */

/**
 * Allow "aborted" flows to trigger effects in some cases.
 * Examples:
 * - When a 1-structure mech suffers structure damage.
 *   The flow is aborted by the `noStructureRemaining` step.
 * - When a 1-stress mech suffers stress.
 *   The flow is aborted by the `noStressRemaining` step.
 */
const _isTriggerOnAbortedFlow = ({ flowName, flow }) => {
    if (flowName === "StructureFlow") return flow.state.data.remStruct === 0;
    if (flowName === "OverheatFlow") return flow.state.data.remStress === 0;
    return false;
};

/**
 * @param {string} options.flowName
 * @param {?((string|Function))} [options.fallbackActionIdentifier]
 */
const _bindFlowHook = options => {
    const { flowName, fallbackActionIdentifier: fallbackActionIdentifier_ = null } = options;

    Hooks.on(`lancer.postFlow.${flowName}`, async (flow, isContinue) => {
        if (!isContinue && !_isTriggerOnAbortedFlow({ flowName, flow })) return;

        const fallbackActionIdentifier =
            fallbackActionIdentifier_ != null && fallbackActionIdentifier_ instanceof Function
                ? fallbackActionIdentifier_(flow)
                : fallbackActionIdentifier_;

        const flowInfo = await _pGetFlowInfo(flow.state, {
            fallbackActionIdentifier,
        });
        if (flowInfo == null) return;

        await processFlowInfo(flowInfo);
    });
};

/* -------------------------------------------- */

const fallbackActionIdentifier_BasicAttackFlow = flow => {
    return flow.state.data.attack_type === "Melee" ? "lwfx_default_melee" : "lwfx_default_ranged";
};

/**
 * Convert a named structure flow to a `lwfx` fake LID.
 *
 * Includes support for "Lancer Alternative Structure"/"Maria's Alternate Ruleset" rules. This renames some results.
 * See:
 *  - https://foundryvtt.com/packages/lancer-alt-structure
 *  - https://docs.google.com/document/d/1unN3HDDeAK3pN1rmgFgZgAXp5flnQ9-KMu-TXt34tnU/edit
 */
const fallbackActionIdentifier_StructureFlow = flow => {
    // Monstrosities have a unique structure table
    if (
        flow.state.actor?.is_npc() &&
        flow.state.actor.itemTypes?.npc_feature?.some(item => ["npcf_unique_physiology_monstrosity", "feature_unique_physiology"].includes(item.system.lid))
    ) {
        switch (flow.state.data.title) {
            case game.i18n.localize("lancer.tables.structureMonstrosity.title.fatal"):
                return "lwfx_monstrosity_fatal";
            case game.i18n.localize("lancer.tables.structureMonstrosity.title.direct"):
                return `lwfx_monstrosity_direct_hit_${Math.clamped(flow.state.data.remStruct, 1, 3)}`;
            case game.i18n.localize("lancer.tables.structureMonstrosity.title.dismember"):
                return "lwfx_monstrosity_dismember";
            case game.i18n.localize("lancer.tables.structureMonstrosity.title.powerful"):
                return "lwfx_monstrosity_powerful_hit";
            case game.i18n.localize("lancer.tables.structureMonstrosity.title.glancing"):
                return "lwfx_monstrosity_glancing_hit";
        }
        return "lwfx_monstrosity_structure";
    }

    switch (flow.state.data.title) {
        case game.i18n.localize("lancer.tables.structure.title.crushing"):
        case game.i18n.localize("LANCER-ALT-STRUCTURE.StructureTitles.crushingHit"):
            return "lwfx_structure_crushing_hit";
        case game.i18n.localize("lancer.tables.structure.title.direct"):
        case game.i18n.localize("LANCER-ALT-STRUCTURE.StructureTitles.directHit"):
            return `lwfx_structure_direct_hit_${Math.clamped(flow.state.data.remStruct, 1, 3)}`;
        case game.i18n.localize("lancer.tables.structure.title.trauma"):
        case game.i18n.localize("LANCER-ALT-STRUCTURE.StructureTitles.systemTrauma"):
            return "lwfx_structure_system_trauma";
        case game.i18n.localize("lancer.tables.structure.title.glancing"):
        case game.i18n.localize("LANCER-ALT-STRUCTURE.StructureTitles.glancingBlow"):
            return "lwfx_structure_glancing_blow";
    }
    return "lwfx_structure";
};

/**
 * Convert a named stress flow to a `lwfx` fake LID.
 *
 * Includes support for "Lancer Alternative Structure"/"Maria's Alternate Ruleset" rules. This renames some results.
 * See:
 *  - https://foundryvtt.com/packages/lancer-alt-structure
 *  - https://docs.google.com/document/d/1unN3HDDeAK3pN1rmgFgZgAXp5flnQ9-KMu-TXt34tnU/edit
 */
const fallbackActionIdentifier_OverheatFlow = flow => {
    switch (flow.state.data.title) {
        case "Irreversible Meltdown":
            return "lwfx_overheat_irreversible_meltdown";

        case "Meltdown":
        case game.i18n.localize("LANCER-ALT-STRUCTURE.StressTitles.meltdown"):
            return `lwfx_overheat_meltdown_${Math.clamped(flow.state.data.remStress, 1, 3)}`;

        case "Destabilized Power Plant":
            return "lwfx_overheat_destabilized_power_plant";

        case "Emergency Shunt":
        case game.i18n.localize("LANCER-ALT-STRUCTURE.StressTitles.emergencyShunt"):
            return "lwfx_overheat_emergency_shunt";

        // Found in "Lancer Alternative Structure"
        case game.i18n.localize("LANCER-ALT-STRUCTURE.StressTitles.criticalFail"):
            return "lwfx_overheat_critical_reactor_failure";

        // Found in "Lancer Alternative Structure"
        case game.i18n.localize("LANCER-ALT-STRUCTURE.StressTitles.powerFail"):
            return "lwfx_overheat_power_failure";
    }
    return "lwfx_overheat";
};

const _onReady = () => {
    // Weapon attacks
    _bindFlowHook({
        flowName: "WeaponAttackFlow",
        fallbackActionIdentifier: fallbackActionIdentifier,
    });
    // Basic attacks
    _bindFlowHook({ flowName: "BasicAttackFlow", fallbackActionIdentifier: fallbackActionIdentifier_BasicAttackFlow });

    // Tech attacks and invades
    _bindFlowHook({ flowName: "TechAttackFlow", fallbackActionIdentifier: "default_tech_attack" });

    // Stabilize
    _bindFlowHook({ flowName: "StabilizeFlow", fallbackActionIdentifier: "lwfx_stabilize" });
    // Full repair
    _bindFlowHook({ flowName: "FullRepairFlow", fallbackActionIdentifier: "lwfx_stabilize" });

    // Core power
    _bindFlowHook({ flowName: "CoreActiveFlow", fallbackActionIdentifier: "lwfx_core_power" });

    // Other activations, which use an action
    // E.g. "Pattern-A Smoke Charges" -> "Use Quick"
    _bindFlowHook({ flowName: "ActivationFlow" });

    // Other activations, which do not use an action
    // E.g. "Rapid Burst Jump Jet System" -> "Use"
    _bindFlowHook({ flowName: "SystemFlow" });

    // Overcharge
    _bindFlowHook({ flowName: "OverchargeFlow", fallbackActionIdentifier: "lwfx_overcharge" });

    // Structure
    _bindFlowHook({ flowName: "StructureFlow", fallbackActionIdentifier: fallbackActionIdentifier_StructureFlow });
    // Structure side effects (equipment destruction)
    _bindFlowHook({ flowName: "SecondaryStructureFlow", fallbackActionIdentifier: "lwfx_structure_secondary" });

    // Stress
    _bindFlowHook({ flowName: "OverheatFlow", fallbackActionIdentifier: fallbackActionIdentifier_OverheatFlow });

    // Cascades (structure/stress side effect)
    _bindFlowHook({ flowName: "CascadeFlow", fallbackActionIdentifier: "lwfx_cascade" });
};

const bindHooks$1 = () => {
    Hooks.on("ready", () => _onReady());
};

const CUSTOM_EFFECT_MODE_NAME = 1;
const CUSTOM_EFFECT_MODE_LID = 2;

const TOUR_ID = "effectsManagerTour";

/* -------------------------------------------- */
/*  Schema                                      */
/* -------------------------------------------- */

const schemaFolder = new foundry.data.fields.SchemaField({
    name: new foundry.data.fields.StringField({
        label: "Name",
    }),

    // TODO(v12) switch to `foundry.data.fields.DocumentUUIDField`
    actorUuid: new foundry.data.fields.StringField({
        type: "Actor",
        label: "lancer-weapon-fx.effectManager.fields.actorUuid.label",
        nullable: true,
    }),

    isCollapsed: new foundry.data.fields.BooleanField({
        initial: false,
    }),
});

const schemaCustomEffect = new foundry.data.fields.SchemaField({
    // TODO(v12) switch to `foundry.data.fields.DocumentUUIDField`
    macroUuid: new foundry.data.fields.StringField({
        type: "Macro",
        label: "lancer-weapon-fx.effectManager.fields.macroUuid.label",
        nullable: true,
    }),

    // TODO(v12) switch to `foundry.data.fields.DocumentUUIDField`
    folderId: new foundry.data.fields.StringField({ nullable: true }),

    mode: new foundry.data.fields.NumberField({
        integer: true,
        choices: [CUSTOM_EFFECT_MODE_NAME, CUSTOM_EFFECT_MODE_LID],
        nullable: true,
        initial: CUSTOM_EFFECT_MODE_NAME,
    }),

    // region Fields specific to "name" mode
    itemName: new foundry.data.fields.StringField({
        label: "Item Name",
        nullable: true,
    }),
    // endregion

    // region Fields specific to "LID" mode
    itemLid: new foundry.data.fields.StringField({
        label: "Lancer ID",
        nullable: true,
    }),
    // endregion
});

/* -------------------------------------------- */
/*  Data Model                                  */
/* -------------------------------------------- */

/**
 * Notes:
 * - `effects` and `folders` should ideally either be `ArrayField`s or `EmbeddedCollectionField`s.
 *    `ArrayField` is unsuitable as it cannot be diff-updated, as Foundry (as of v11) does not implement specific
 *    update logic for `ArrayField`s and so updating the fields clobbers the data.
 *    `EmbeddedCollectionField` is unsuitable as it can only be used with `Document` subclasses, i.e. a `DataModel`
 *    with DB backing, and as we are not storing our state as a document in the DB, we therefore cannot use this
 *    field type.
 * - The above schemas (`schemaFolder`, `schemaCustomEffect`) cannot be used as part of the main `DataModel`, as there
 *   is no `"*" -> "datamodel"` field type. Instead, we implement validation (`validate`) using the sub-schemas to
 *   achieve the same effect.
 */
class EffectManagerData extends foundry.abstract.DataModel {
    /** @override */
    static defineSchema() {
        return {
            effects: new foundry.data.fields.ObjectField({
                initial: () => ({}),
                validate: (value, options) => {
                    return (
                        Object.keys(value).every(id => id != null && id.trim()) &&
                        Object.values(value).every(obj => {
                            const isValid = schemaCustomEffect.validate(obj, options);
                            if (isValid === undefined) return true;
                            return isValid;
                        })
                    );
                },
            }),

            folders: new foundry.data.fields.ObjectField({
                initial: () => ({}),
                validate: (value, options) => {
                    return (
                        Object.keys(value).every(id => id != null && id.trim()) &&
                        Object.values(value).every(obj => {
                            const isValid = schemaFolder.validate(obj, options);
                            if (isValid === undefined) return true;
                            return isValid;
                        })
                    );
                },
            }),
        };
    }
}

/**
 * Singleton app to manage effects.
 *
 * Notes on singleton implementation:
 * - If two GM users both have the app open, and one GM edits the state, we want the state to sync to both apps for
 *   both clients.
 *   The world-level game setting therefore triggers `onStateChange` here, causing a re-render.
 * - As a side effect of the above, changing the state in the app locally does not directly trigger a re-render for the
 *   app. Instead, a cascade of effects occurs:
 *     `GM makes change in UI -> change is saved to world state -> world state change triggers re-render`
 * - The app has an `id` provided in the `defaultOptions`. This gives us some singleton behaviour for free.
 *   Positive:
 *   - Opening a new instance of the manager re-uses the existing window. The app therefore appears as a singleton to
 *     the user.
 *   Negative:
 *   - The new instance *steals* the window from the existing app, without closing or cleaning up the existing app.
 *     The old app will still be "open" so we need to avoid triggering renders for every effect manager, and instead
 *     render only the most recently opened (and therefore visible) one. Note that Foundry passes in the "inner"
 *     element to `activateListeners` and so we are safe to bind event listeners.
 */
class EffectManagerApp extends FormApplication {
    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: `${MODULE_ID}-effects-manager`,
            template: `modules/${MODULE_ID}/templates/effectManager/effect-manager.hbs`,
            title: game.i18n.localize(`${MODULE_ID}.effectManager.app.Effects Manager`),
            width: 800,
            height: 800,
            submitOnChange: true,
            closeOnSubmit: false,
            scrollY: [".lwfx__scrollable"],
            resizable: true,
            classes: ["lancer sheet"],
            dragDrop: [
                {
                    dragSelector: "[data-drag-type]",
                    dropSelector: "[data-drop-target]",
                },
            ],
        });
    }

    /* -------------------------------------------- */

    static _appActive = null;

    static onStateChange({ state }) {
        if (!this._appActive) return;
        this._appActive.setState(state);
        this._appActive.render();
    }

    /* -------------------------------------------- */

    /** @type {?Array<Macro>} */
    static _macroLookup = null;

    static async _pInitMacroLookup() {
        if (this._macroLookup) return;

        const pack = game.packs.get(PACK_ID_WEAPONFX);
        if (!pack) {
            this._macroLookup = [];
            ui.notifications.error(`Lancer Weapon FX | Compendium ${PACK_ID_WEAPONFX} not found`);
            return;
        }

        const index = await pack.getIndex();

        this._macroLookup = index
            .map(({ name, uuid }) => ({ name, uuid }))
            .sort(({ name: nameA }, { name: nameB }) => nameA.localeCompare(nameB, { sensitivity: "base" }));
    }

    /* -------------------------------------------- */

    /** @type {?EffectManagerData} */
    _datamodel;

    /** @type {?Object} */
    _iptsTransient;

    constructor(...args) {
        super(...args);
        EffectManagerApp._appActive = this;
        this.setState(
            game.settings.get(MODULE_ID, SETTING_EFFECTS_MANAGER_STATE) || new EffectManagerData().toObject(),
        );
    }

    setState(state) {
        if (!state) throw new Error(`Missing state!`);
        this._datamodel = new EffectManagerData(state);
    }

    /* -------------------------------------------- */

    /** @override */
    async _render(force, options) {
        await this.constructor._pInitMacroLookup();
        return super._render(force, options);
    }

    /** @override */
    async _renderInner(...args) {
        const html = await super._renderInner(...args);
        const el = html instanceof jQuery ? html[0] : html;

        this._iptsTransient = {};
        el.querySelectorAll("[data-name-transient]").forEach(ipt => {
            const nameTransient = ipt.getAttribute("data-name-transient");
            foundry.utils.setProperty(this._iptsTransient, nameTransient, ipt);
        });

        return html;
    }

    /* -------------------------------------------- */

    /** @override */
    async close(options) {
        if (this.constructor._appActive === this) this.constructor._appActive = null;
        return super.close(options);
    }

    /* -------------------------------------------- */

    /** @type {?Object<string, string>} */
    _getDataCache_macro_choices;

    /** @type {?Array<string>} */
    _getDataCache_lids;

    /** @override */
    async getData(options = {}) {
        const dataModel = this._datamodel.toObject();

        const effectCounts = this._getData_getEffectCounts({ dataModel });

        const effects = Object.entries(dataModel.effects).map(([id, effect]) => ({
            id,
            ...effect,
            isDuplicate: this._getData_isEffectDuplicate({ dataModel, effect, effectCounts }),
        }));

        const folders = await Promise.all(
            Object.entries(dataModel.folders).map(async ([id, folder]) => ({
                id,
                ...folder,
                actorLink: await this._getData_pGetActorLinkHtml({ actorUuid: folder.actorUuid }),
                effects: effects.filter(effect => effect.folderId === id),
            })),
        );

        this._getDataCache_macro_choices ||= Object.fromEntries(
            this.constructor._macroLookup.map(({ name, uuid }) => [uuid, name]),
        );

        this._getDataCache_lids ||= Array.from(
            new Set([
                ...Object.keys(EFFECTS_WEAR_AND_TEAR),
                ...Object.keys(EFFECTS_GEAR),

                "lwfx_core_power",
                "lwfx_cascade",
                "lwfx_overcharge",
                "lwfx_overheat",
                "lwfx_overheat_emergency_shunt",
                "lwfx_overheat_destabilized_power_plant",
                "lwfx_overheat_meltdown_3",
                "lwfx_overheat_meltdown_2",
                "lwfx_overheat_meltdown_1",
                "lwfx_overheat_irreversible_meltdown",
                "lwfx_stabilize",
                "lwfx_structure",
                "lwfx_structure_glancing_blow",
                "lwfx_structure_system_trauma",
                "lwfx_structure_secondary",
                "lwfx_structure_direct_hit_3",
                "lwfx_structure_direct_hit_2",
                "lwfx_structure_direct_hit_1",
                "lwfx_structure_crushing_hit",
                "lwfx_overheat_power_failure",
                "lwfx_overheat_critical_reactor_failure",
            ]),
        ).sort((a, b) => a.localeCompare(b, { sensitivity: "base" }));

        return {
            // TODO(v12) use fields to generate inputs
            fields: this._datamodel.schema.fields,

            effects,

            folders,

            effectsUncategorized: effects.filter(effect => effect.folderId == null),

            isDisplayUsageHint: !effects.length && !folders.length,
            isDisplayEffectsUncategorized: effects.length,

            rowModes: {
                choices: {
                    [CUSTOM_EFFECT_MODE_NAME]: game.i18n.localize(`${MODULE_ID}.effectManager.app.Name`),
                    [CUSTOM_EFFECT_MODE_LID]: game.i18n.localize(`${MODULE_ID}.effectManager.app.Lancer ID`),
                },
                CUSTOM_EFFECT_MODE_NAME,
                CUSTOM_EFFECT_MODE_LID,
            },

            macros: {
                choices: this._getDataCache_macro_choices,
            },

            lids: this._getDataCache_lids,
        };
    }

    async _getData_pGetActorLinkHtml({ actorUuid }) {
        if (actorUuid == null) return null;

        // Fake a regex match
        const lnk = await TextEditor._createContentLink([
            `@UUID[${actorUuid}]`, // m0, full match
            "UUID", // m1, type
            actorUuid, // m2, target
        ]);
        if (!lnk) return null;

        lnk.classList.add("lwfx-effects-manager__actor-link");

        return lnk.outerHTML;
    }

    _getData_getEffectCountPath({ dataModel, effect, searchName }) {
        const actorUuid = dataModel.folders[effect.folderId]?.actorUuid || "_";
        return ["name", actorUuid, effect.mode, searchName].join(".");
    }

    _getData_getEffectCounts({ dataModel }) {
        const effectCounts = {};

        Object.values(dataModel.effects).forEach(effect => {
            switch (effect.mode) {
                case CUSTOM_EFFECT_MODE_NAME: {
                    const searchName = getSearchString(effect.itemName);
                    if (!searchName) return;
                    const propPath = this._getData_getEffectCountPath({ dataModel, effect, searchName });
                    foundry.utils.setProperty(
                        effectCounts,
                        propPath,
                        (foundry.utils.getProperty(effectCounts, propPath) || 0) + 1,
                    );
                    return;
                }

                case CUSTOM_EFFECT_MODE_LID: {
                    const searchName = getSearchString(effect.itemLid);
                    if (!searchName) return;
                    const propPath = this._getData_getEffectCountPath({ dataModel, effect, searchName });
                    foundry.utils.setProperty(
                        effectCounts,
                        propPath,
                        (foundry.utils.getProperty(effectCounts, propPath) || 0) + 1,
                    );
                    return;
                }

                default:
                    throw new Error(`Unknown mode: ${effect.mode}`);
            }
        });

        return effectCounts;
    }

    _getData_isEffectDuplicate({ dataModel, effect, effectCounts }) {
        switch (effect.mode) {
            case CUSTOM_EFFECT_MODE_NAME: {
                const propPath = this._getData_getEffectCountPath({
                    dataModel,
                    effect,
                    searchName: getSearchString(effect.itemName),
                });
                return foundry.utils.getProperty(effectCounts, propPath) > 1;
            }

            case CUSTOM_EFFECT_MODE_LID: {
                const propPath = this._getData_getEffectCountPath({
                    dataModel,
                    effect,
                    searchName: getSearchString(effect.itemLid),
                });
                return foundry.utils.getProperty(effectCounts, propPath) > 1;
            }

            default:
                throw new Error(`Unknown mode: ${effect.mode}`);
        }
    }

    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        const el = html instanceof jQuery ? html[0] : html;

        el.addEventListener("click", evt => {
            const target = evt.target;

            const btnEffectCreate = target.closest('[name="btn-effect-create"]');
            if (btnEffectCreate) {
                this._handleClick_createEffect(evt);
                return;
            }

            const btnFolderCreate = target.closest('[name="btn-folder-create"]');
            if (btnFolderCreate) {
                this._handleClick_createFolder(evt);
                return;
            }

            const btnExport = target.closest('[name="btn-export"]');
            if (btnExport) {
                this._handleClick_export(evt);
                return;
            }

            const btnImport = target.closest('[name="btn-import"]');
            if (btnImport) {
                this._handleClick_import(evt);
                return;
            }

            const btnStartTour = target.closest('[name="btn-start-tour"]');
            if (btnStartTour) {
                this._handleClick_startTour(evt);
                return;
            }

            const btnSelectedDelete = target.closest('[name="btn-selected-delete"]');
            if (btnSelectedDelete) {
                this._handleClick_deleteSelected(evt);
                return;
            }

            const btnFolderExpandCollapse = target.closest('[name="btn-folder-expand-collapse"]');
            if (btnFolderExpandCollapse) {
                this._handleClick_folderExpandCollapse(evt);
                return;
            }

            const btnFolderCreateEffect = target.closest('[name="btn-folder-create-effect"]');
            if (btnFolderCreateEffect) {
                this._handleClick_folderCreateEffect(evt);
                return;
            }

            const btnFolderActorUnlink = target.closest('[data-name="btn-folder-actor-unlink"]');
            if (btnFolderActorUnlink) {
                this._handleClick_folderActorUnlink(evt);
                return;
            }

            const btnFolderDelete = target.closest('[name="btn-folder-delete"]');
            if (btnFolderDelete) {
                this._handleClick_folderDelete(evt);
                return;
            }

            const btnEffectPlay = target.closest('[name="btn-effect-play"]');
            if (btnEffectPlay) {
                this._handleClick_playPreview(evt);
                return;
            }
        });

        el.addEventListener("change", evt => {
            const target = evt.target;

            const dataNameProxy = target.closest('[data-name-proxy]');
            if (dataNameProxy) {
                this._handleChange_inputProxy(evt);
                return;
            }
        });

        this._iptsTransient["select-all"].addEventListener("change", this._handleChange_cbSelectAll.bind(this));
        Object.entries(this._iptsTransient["effects"] || {}).forEach(([, nameTo]) => {
            nameTo["isSelected"].addEventListener("change", this._handleChange_cbEffect.bind(this));
        });
    }

    /* ----- */

    async _handleChange_cbSelectAll(evt) {
        evt.stopPropagation();

        const val = this._iptsTransient["select-all"].checked;
        Object.entries(this._iptsTransient["effects"]).forEach(([, nameTo]) => (nameTo["isSelected"].checked = val));
    }

    async _handleChange_cbEffect(evt) {
        evt.stopPropagation();

        const cntSelected = Object.entries(this._iptsTransient["effects"]).reduce(
            (cnt, [, nameTo]) => cnt + Number(nameTo["isSelected"].checked),
            0,
        );

        if (!cntSelected) {
            this._iptsTransient["select-all"].checked = false;
            this._iptsTransient["select-all"].indeterminate = false;
            return;
        }

        const cntEffects = Object.keys(this._datamodel.effects).length;
        if (cntEffects === cntSelected) {
            this._iptsTransient["select-all"].checked = true;
            this._iptsTransient["select-all"].indeterminate = false;
            return;
        }

        this._iptsTransient["select-all"].checked = true;
        this._iptsTransient["select-all"].indeterminate = true;
    }

    /* ----- */

    async _handleClick_createEffect(evt) {
        await this._updateObject(null, {
            [`effects.${foundry.utils.randomID()}`]: this._getNewEffect(),
        });
    }

    async _handleClick_createFolder(evt) {
        await this._updateObject(null, {
            [`folders.${foundry.utils.randomID()}`]: this._getNewFolder(),
        });
    }

    async _handleClick_export(evt) {
        saveDataToFile(
            JSON.stringify(this._datamodel.toObject(), null, 2),
            "text/json",
            `${MODULE_ID}-custom-effects.json`,
        );
    }

    async _handleClick_import(evt) {
        new Dialog(
            {
                title: game.i18n.localize(`${MODULE_ID}.effectManager.app.Import Custom Effects`),
                content: await renderTemplate("templates/apps/import-data.html", {
                    hint1: game.i18n.localize(`${MODULE_ID}.effectManager.app.Import Custom Effects Hint 1`),
                    hint2: game.i18n.localize(`${MODULE_ID}.effectManager.app.Import Custom Effects Hint 2`),
                }),
                buttons: {
                    import: {
                        icon: `<i class="fas fa-file-import"></i>`,
                        label: game.i18n.localize(`${MODULE_ID}.effectManager.app.Import`),
                        callback: async html => {
                            const el = html instanceof jQuery ? html[0] : html;
                            const form = el.querySelector("form");
                            if (!form.data.files.length)
                                return ui.notifications.error("You did not upload a data file!");
                            const txt = await readTextFromFile(form.data.files[0]);

                            let json;
                            try {
                                json = JSON.parse(txt);
                            } catch (e) {
                                return ui.notifications.error(`File was not valid JSON! ${e.message}`);
                            }

                            let state;
                            try {
                                state = new EffectManagerData(json);
                            } catch (e) {
                                return ui.notifications.error(`JSON file did not contain valid state! ${e.message}`);
                            }

                            game.settings.set(MODULE_ID, SETTING_EFFECTS_MANAGER_STATE, state.toObject());
                        },
                    },
                    no: {
                        icon: `<i class="fas fa-times"></i>`,
                        label: "Cancel",
                    },
                },
                default: "import",
            },
            {
                width: 400,
            },
        ).render(true);
    }

    async _handleClick_startTour(evt) {
        const tour = game.tours.get(`${MODULE_ID}.${TOUR_ID}`);
        await tour.reset();
        if (tour?.status !== Tour.STATUS.UNSTARTED) return;
        tour.start();
    }

    async _handleClick_deleteSelected(evt) {
        const effectIds = Object.entries(this._iptsTransient["effects"])
            .filter(([, nameTo]) => nameTo["isSelected"].checked)
            .map(([effectId]) => effectId);
        if (!effectIds.length) return ui.notifications.warn(`Please select some effects first!`);

        if (
            !(await Dialog.confirm({
                title: game.i18n.localize("lancer-weapon-fx.effectManager.app.Delete Selected Effects"),
                content: `<h4>${game.i18n.localize("AreYouSure")}</h4><p>${game.i18n.format("lancer-weapon-fx.effectManager.app.Delete Selected Effects Hint", { count: effectIds.length })}</p>`,
            }))
        )
            return;

        await this._updateObject(null, Object.fromEntries(effectIds.map(effectId => [`effects.-=${effectId}`, null])));
    }

    /* ----- */

    async _handleClick_folderExpandCollapse(evt) {
        const folderId = evt.currentTarget.closest("[data-folder-id]")?.getAttribute("data-folder-id");
        if (!folderId) throw new Error("Should never occur!");

        await this._updateObject(null, {
            [`folders.${folderId}`]: {
                isCollapsed: !this._datamodel.folders[folderId].isCollapsed,
            },
        });
    }

    async _handleClick_folderCreateEffect(evt) {
        const folderId = evt.currentTarget.closest("[data-folder-id]").getAttribute("data-folder-id");

        await this._updateObject(null, {
            [`effects.${foundry.utils.randomID()}`]: this._getNewEffect({ folderId }),
        });
    }

    async _handleClick_folderActorUnlink(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        const folderId = evt.currentTarget.closest("[data-folder-id]").getAttribute("data-folder-id");
        if (!folderId) throw new Error("Should never occur!");

        await this._updateObject(null, {
            [`folders.${folderId}`]: {
                actorUuid: null,
            },
        });
    }

    async _handleClick_folderDelete(evt) {
        const folderId = evt.currentTarget.closest("[data-folder-id]").getAttribute("data-folder-id");
        if (!folderId) throw new Error("Should never occur!");

        await this._updateObject(null, {
            [`folders.-=${folderId}`]: null,

            ...this._handleClick_folderDelete_getEffectChanges({ evt, folderId }),
        });
    }

    _handleClick_folderDelete_getEffectChanges({ evt, folderId }) {
        const effectEntries = Object.entries(this._datamodel.effects).filter(
            ([, effect]) => effect.folderId === folderId,
        );

        // On SHIFT-click also delete all contained effects
        if (evt.shiftKey) {
            return Object.fromEntries(effectEntries.map(([id]) => [`effects.-=${id}`, null]));
        }

        // On regular click, move effects from the deleted folder to "uncategorized" effects
        return Object.fromEntries(effectEntries.map(([id]) => [`effects.${id}.folderId`, null]));
    }

    /* ----- */

    _handleChange_inputProxy(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        const ele = evt.currentTarget;
        const name = ele.getAttribute("data-name-proxy");

        const eleInput = this.form.querySelector(`[name="${name}"]`);
        eleInput.value = ele.value;
        eleInput.dispatchEvent(
            new Event("change", {
                bubbles: true,
                cancelable: true,
            }),
        );
    }

    async _handleClick_playPreview(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        // Most macros need at least a source token. Ensure the user has one selected.
        const macroVariables = getMacroVariables();
        if (!macroVariables.sourceToken) return ui.notifications.warn("Please select a token first!");

        const effectId = evt.currentTarget.closest("[data-effect-id]").getAttribute("data-effect-id");

        const macro = await fromUuid(this._datamodel.effects[effectId].macroUuid);

        try {
            await macro.execute({});
        } catch (e) {
            console.error(e);

            // Many macros also require a target token. Prompt the user to select one if the macro failed.
            ui.notifications.warn("Macro failed to execute! You may have to target a token first.");
        }
    }

    /* -------------------------------------------- */

    /** @inheritdoc */
    _onDragStart(evt) {
        evt.stopPropagation();

        const effectId = evt.currentTarget.closest("[data-effect-id]")?.getAttribute("data-effect-id");
        const folderId = evt.currentTarget.closest("[data-folder-id]")?.getAttribute("data-folder-id");

        if (!effectId) return;

        const dragData = {
            type: `${MODULE_ID}.folderize`,
            payload: {
                effectId,
                folderId,
            },
        };

        evt.dataTransfer.setData("text/plain", JSON.stringify(dragData));
    }

    /* -------------------------------------------- */

    /** @inheritdoc */
    async _onDrop(evt) {
        evt.stopPropagation();

        const data = TextEditor.getDragEventData(evt);

        if (data.lancerType) return this._onDrop_lancerFlow({ evt, data });

        const { type, payload } = data;

        switch (type) {
            case `${MODULE_ID}.folderize`:
                return this._onDrop_folderize({ evt, payload });

            case "Item":
                return this._onDrop_item({ evt, data });

            case "Macro":
                return this._onDrop_macro({ evt, data });

            case "Actor":
                return this._onDrop_actor({ evt, data });
        }
    }

    async _onDrop_lancerFlow({ evt, data }) {
        switch (data.lancerType) {
            case "frame": {
                return this._onDrop_lancerFlow_frame({ evt, data });
            }
        }
    }

    async _onDrop_lancerFlow_frame({ evt, data }) {
        const { flowType, uuid } = data;

        if (flowType !== "core_system.activation-flow") return;

        const eleEffect = evt.currentTarget.closest("[data-effect-id]");
        const eleFolder = evt.currentTarget.closest("[data-folder-id]");

        const item = await fromUuid(uuid);
        if (!item) return;

        return this._createEffectFromDroppedItem({
            effectId: eleEffect?.getAttribute("data-effect-id"),
            folderId: eleFolder?.getAttribute("data-folder-id"),
            item,
        });
    }

    async _onDrop_folderize({ evt, payload }) {
        const dropTarget = evt.currentTarget.closest(
            `[data-drop-target="folder"], [data-drop-target="effects-uncategorized"]`,
        );
        if (!dropTarget) return;

        const dropTargetType = dropTarget.getAttribute("data-drop-target");

        const folderId = dropTargetType === "effects-uncategorized" ? null : dropTarget.getAttribute("data-folder-id");

        await this._updateObject(null, {
            [`effects.${payload.effectId}.folderId`]: folderId,
        });
    }

    async _onDrop_item({ evt, data }) {
        const eleEffect = evt.currentTarget.closest("[data-effect-id]");
        const eleFolder = evt.currentTarget.closest("[data-folder-id]");
        const item = await fromUuid(data.uuid);

        if (!item) return;

        return this._createEffectFromDroppedItem({
            effectId: eleEffect?.getAttribute("data-effect-id"),
            folderId: eleFolder?.getAttribute("data-folder-id"),
            item,
        });
    }

    async _onDrop_macro({ evt, data }) {
        const eleEffect = evt.currentTarget.closest("[data-effect-id]");
        const eleFolder = evt.currentTarget.closest("[data-folder-id]");
        const macro = await fromUuid(data.uuid);

        // If dropped to an existing row, update that row
        if (eleEffect) {
            const effectId = eleEffect.getAttribute("data-effect-id");

            return this._updateObject(null, {
                [`effects.${effectId}.macroUuid`]: macro.uuid,
            });
        }

        // Otherwise, create a new row
        const folderId = eleFolder ? eleFolder.getAttribute("data-folder-id") : null;
        return this._updateObject(null, {
            [`effects.${foundry.utils.randomID()}`]: this._getNewEffect({
                macroUuid: macro.uuid,
                folderId,
            }),
        });
    }

    async _onDrop_actor({ evt, data }) {
        const eleFolder = evt.currentTarget.closest("[data-folder-id]");

        const actor = await fromUuid(data.uuid);

        // If dropped to an existing row, update that row
        if (eleFolder) {
            const folderId = eleFolder.getAttribute("data-folder-id");
            if (!folderId) throw new Error("Should never occur!");

            return this._updateObject(null, {
                [`folders.${folderId}.actorUuid`]: actor.uuid,
            });
        }

        // Otherwise, create a new row
        return this._updateObject(null, {
            [`folders.${foundry.utils.randomID()}`]: this._getNewFolder({
                actorUuid: actor.uuid,
            }),
        });
    }

    /* -------------------------------------------- */

    async _createEffectFromDroppedItem({ effectId, folderId, item }) {
        // If dropped to an existing row, update that row
        if (effectId) {
            if (item.system?.lid) {
                return this._updateObject(null, {
                    [`effects.${effectId}`]: {
                        mode: CUSTOM_EFFECT_MODE_LID,
                        itemLid: item.system.lid,
                    },
                });
            }

            return this._updateObject(null, {
                [`effects.${effectId}`]: {
                    mode: CUSTOM_EFFECT_MODE_NAME,
                    itemName: item.name,
                },
            });
        }

        // Otherwise, create a new row
        if (item.system?.lid) {
            return this._updateObject(null, {
                [`effects.${foundry.utils.randomID()}`]: this._getNewEffect({
                    folderId,
                    mode: CUSTOM_EFFECT_MODE_LID,
                    itemLid: item.system.lid,
                }),
            });
        }

        return this._updateObject(null, {
            [`effects.${foundry.utils.randomID()}`]: this._getNewEffect({
                folderId,
                mode: CUSTOM_EFFECT_MODE_NAME,
                itemName: item.name,
            }),
        });
    }

    /* -------------------------------------------- */

    /** @override */
    async _onChangeInput(evt) {
        // Do not fire change events for non-"state" inputs
        if (
            evt.currentTarget?.getAttribute("data-name-transient") ||
            evt.currentTarget?.getAttribute("data-name-proxy")
        ) {
            evt.stopPropagation();
            return;
        }

        return super._onChangeInput(evt);
    }

    /* -------------------------------------------- */

    /** @override */
    async _updateObject(_ = null, formData = null) {
        if (!game.user.isGM) throw new Error("Should never occur!");

        formData ||= {};
        formData = foundry.utils.flattenObject(formData);

        // Re-type `.mode`s as integers
        Object.entries(formData)
            .filter(([k]) => k.endsWith(".mode"))
            .forEach(([k, v]) => (formData[k] = Number(v)));

        this._datamodel.updateSource(formData);

        await game.settings.set(MODULE_ID, SETTING_EFFECTS_MANAGER_STATE, this._datamodel.toObject());
    }

    /* -------------------------------------------- */

    _getNewEffect({ macroUuid, folderId, mode, itemName, itemLid } = {}) {
        return {
            macroUuid: macroUuid || null,
            folderId: folderId || null,
            mode: mode || CUSTOM_EFFECT_MODE_NAME,
            itemName: itemName || null,
            itemLid: itemLid || null,
        };
    }

    _getNewFolder({ name, actorUuid, isCollapsed } = {}) {
        return {
            name: name || null,
            actorUuid: actorUuid || null,
            isCollapsed: isCollapsed || false,
        };
    }
}

const bindHooks = () => {
    Hooks.once("init", () => {
        // Add the button to the module settings
        game.settings.registerMenu(MODULE_ID, "effectsManagerMenu", {
            name: "lancer-weapon-fx.effectManager.settings.Effects Manager",
            label: "lancer-weapon-fx.effectManager.settings.Open Effects Manager",
            icon: "fas fa-explosion",
            type: EffectManagerApp,
            restricted: true, // GM only, as we modify a game setting
        });

        game.settings.register(MODULE_ID, SETTING_EFFECTS_MANAGER_STATE, {
            name: "Effects Manager State",
            scope: "world",
            config: false,
            type: Object,
            default: new EffectManagerData().toObject(),
            onChange: state => {
                EffectManagerApp.onStateChange({ state });
            },
        });

        // Register Handlebars partials
        loadTemplates({
            [`${MODULE_ID}.effect-manager-effect-row`]: `modules/${MODULE_ID}/templates/effectManager/partial/effect-row.hbs`,
            [`${MODULE_ID}.effect-manager-folder-row`]: `modules/${MODULE_ID}/templates/effectManager/partial/folder-row.hbs`,
        }).then(null);

        // Register Tour
        Tour.fromJSON(`modules/${MODULE_ID}/tours/effect-manager.json`).then(tour =>
            game.tours.register(MODULE_ID, TOUR_ID, tour),
        );

        // Show the tour when opening the manager for the first time
        Hooks.on("renderEffectManagerApp", async () => {
            const tour = game.tours.get(`${MODULE_ID}.${TOUR_ID}`);
            if (tour?.status !== Tour.STATUS.UNSTARTED) return;

            await tour.start();

            // Force the tour to re-render its starting step. This prevents it from disappearing when:
            //   - We click the settings button to open the app
            //   - The app opens, triggering a "pointerleave" event on the button, as the app now occludes the button
            //   - The tooltip manager queues up a "deactivate tooltip" task, on a timer
            //   - Our app finishes rendering; our hook here triggers, the tour start
            //   - The tooltip manager's timer pops, and it deactivates our tour's tooltip.
            setTimeout(() => {
                tour.progress(0);
            }, 50);
        });
    });
};

bindHooks$4();
bindHooks$3();
bindHooks$2();
bindHooks$1();
bindHooks();
