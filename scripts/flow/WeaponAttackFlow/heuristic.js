import { MODULE_ID } from "../../consts.js";
import { SETTING_IS_WEAPON_HEURISTIC_ACTIVE } from "../../settings.js";

const getPrimaryDamageType = ({ activeProfile }) => {
    return activeProfile.all_damage?.[0]?.type;
};

const getPrimaryRange = ({ activeProfile }) => {
    return activeProfile.all_range?.[0]?.type;
};

const isShotgun = ({ name, activeProfile }) => {
    if (getPrimaryRange({ activeProfile }) === "Cone") return true;
    return /\bshotgun\b/i.test(name);
};

const isMachineGun = ({ name }) => {
    return /\b(?:assault|lmg|hmg|machine gun|minigun)\b/i.test(name);
};

export const fallbackActionIdentifier = flow => {
    if (!game.settings.get(MODULE_ID, SETTING_IS_WEAPON_HEURISTIC_ACTIVE)) return null;

    const activeProfile = flow.state.item?.system?.active_profile;
    if (!activeProfile) return null;

    const {
        name,
        system: { size },
    } = flow.state.item;

    switch (flow.state.item.system.active_profile.type) {
        case "Melee": {
            return "lwfx_heuristic_melee";
        }

        case "CQB": {
            if (getPrimaryDamageType({ activeProfile }) === "Energy") return "lwfx_heuristic_cqb_energy";
            if (isShotgun({ name, activeProfile })) return "lwfx_heuristic_cqb_shotgun";
            return "lwfx_heuristic_cqb_other";
        }

        case "Rifle": {
            if (getPrimaryDamageType({ activeProfile }) === "Energy") return "lwfx_heuristic_rifle_energy";
            if (isMachineGun({ name })) {
                if (["Heavy", "Superheavy"].includes(size)) return "lwfx_heuristic_rifle_mg";
                return "lwfx_heuristic_rifle_ar";
            }
            return "lwfx_heuristic_rifle_other";
        }

        case "Launcher": {
            return "lwfx_heuristic_launcher";
        }

        case "Cannon": {
            if (getPrimaryDamageType({ activeProfile }) === "Energy") return "lwfx_heuristic_cannon_energy";
            if (isMachineGun({ name })) return "lwfx_heuristic_cannon_mg";
            return "lwfx_heuristic_cannon_other";
        }

        case "Nexus": {
            return "lwfx_heuristic_nexus";
        }
    }

    return null;
};
