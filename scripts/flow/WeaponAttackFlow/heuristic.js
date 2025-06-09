import { MODULE_ID } from "../../consts.js";
import { SETTING_IS_WEAPON_HEURISTIC_ACTIVE } from "../../settings.js";

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

export const fallbackActionIdentifier = flow => {
    if (flow.state.item?.type === "npc_feature") return new _HeuristicNpc(flow).getFallbackActionIdentifier();
    return new _HeuristicMech(flow).getFallbackActionIdentifier();
};
