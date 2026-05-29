/**
 * Lancer Weapon FX - NPC Weapon Mapper Macro
 * 
 * Este macro varre os itens do seu mundo, atores e compêndios em busca de armas de NPCs
 * (npc_feature do tipo "Weapon") e exibe uma interface bonita e moderna para relacionar
 * cada uma delas com os efeitos visuais do Lancer Weapon FX.
 */

(async () => {
    const MODULE_ID = "lancer-weapon-fx";
    const SETTING_EFFECTS_MANAGER_STATE = "effectsManagerState";
    const COMPENDIUM_FX = "lancer-weapon-fx.weaponfx";

    // 1. Obter todas as macros de efeitos visuais disponíveis no compêndio
    const pack = game.packs.get(COMPENDIUM_FX);
    if (!pack) {
        ui.notifications.error("Compêndio do Lancer Weapon FX não encontrado!");
        return;
    }
    const fxMacros = (await pack.getDocuments()).map(m => ({
        id: m.id,
        name: m.name,
        uuid: m.uuid
    })).sort((a, b) => a.name.localeCompare(b.name));

    // 2. Obter o estado atual de mapeamentos customizados do módulo
    const currentState = game.settings.get(MODULE_ID, SETTING_EFFECTS_MANAGER_STATE) || { effects: {}, folders: {} };
    const currentEffects = currentState.effects || {};

    // 3. Varrer o mundo para encontrar armas de NPCs únicas (baseadas em LID)
    const npcWeapons = [];
    const seenLids = new Set();

    const scanItem = (item) => {
        if (item.type === "npc_feature" && item.system?.type === "Weapon") {
            const lid = item.system.lid;
            if (lid && !seenLids.has(lid)) {
                seenLids.add(lid);
                npcWeapons.push({
                    name: item.name,
                    lid: lid,
                    img: item.img || "systems/lancer/assets/icons/npc_feature.svg"
                });
            }
        }
    };

    // Varre itens do mundo
    game.items.forEach(scanItem);

    // Varre atores do mundo
    game.actors.forEach(actor => actor.items.forEach(scanItem));

    // Opcional: Varre também compêndios de itens que estejam abertos/carregados
    for (let pack of game.packs.values()) {
        if (pack.documentName === "Item" && pack.indexed) {
            pack.index.forEach(entry => {
                // Se for npc_feature
                if (entry.type === "npc_feature") {
                    const lid = entry.system?.lid || `compendium_${entry._id}`;
                    if (lid && !seenLids.has(lid)) {
                        seenLids.add(lid);
                        npcWeapons.push({
                            name: entry.name,
                            lid: lid,
                            img: entry.img || "systems/lancer/assets/icons/npc_feature.svg"
                        });
                    }
                }
            });
        }
    }

    if (npcWeapons.length === 0) {
        ui.notifications.warn("Nenhuma arma de NPC (npc_feature do tipo 'Weapon') foi encontrada no seu mundo ou atores ativos!");
        return;
    }

    npcWeapons.sort((a, b) => a.name.localeCompare(b.name));

    // Heurística inteligente para sugerir efeitos com base no nome da arma
    const getSuggestedMacro = (name) => {
        const lower = name.toLowerCase();
        
        // Mapeamento de palavras-chave para nomes exatos de macros no compêndio
        if (lower.includes("míssil") || lower.includes("missil") || lower.includes("foguete") || lower.includes("missile") || lower.includes("rocket")) {
            if (lower.includes("pinaka")) return "MissilePinaka";
            return "Missiles";
        }
        if (lower.includes("laser") || lower.includes("raio") || lower.includes("feixe")) return "Lasers";
        if (lower.includes("plasma")) {
            if (lower.includes("lança") || lower.includes("thrower")) return "Plasma Thrower";
            if (lower.includes("talon") || lower.includes("garra")) return "Plasma Talons";
            return "Plasma Rifle";
        }
        if (lower.includes("chamas") || lower.includes("fogo") || lower.includes("incendiário") || lower.includes("flame") || lower.includes("flamethrower")) return "Flamethrower";
        if (lower.includes("pistola") || lower.includes("pistol") || lower.includes("ferrão")) return "Pistol";
        if (lower.includes("metralhadora") || lower.includes("heavy machine") || lower.includes("hmg") || lower.includes("rotary")) return "HMG";
        if (lower.includes("fuzil") || lower.includes("rifle")) {
            if (lower.includes("antimaterial") || lower.includes("anti-armor") || lower.includes("sniper")) return "AMR";
            if (lower.includes("veil")) return "Veil Rifle";
            if (lower.includes("warp")) return "Warp Rifle";
            return "Assault Rifle";
        }
        if (lower.includes("escopeta") || lower.includes("shotgun") || lower.includes("espingarda") || lower.includes("drum") || lower.includes("cannibal")) return "Shotgun";
        if (lower.includes("martelo") || lower.includes("hammer") || lower.includes("demolição")) return "Hammer";
        if (lower.includes("espada") || lower.includes("lâmina") || lower.includes("faca") || lower.includes("blade") || lower.includes("sword") || lower.includes("knife") || lower.includes("machado") || lower.includes("corte")) {
            if (lower.includes("aquecida") || lower.includes("charged")) return "Charged Blade";
            return "DefaultMelee";
        }
        if (lower.includes("chicote") || lower.includes("whip")) return "Nanobot Whip";
        if (lower.includes("arco") || lower.includes("arrow") || lower.includes("bow")) return "ArcBow";
        if (lower.includes("choque") || lower.includes("elétrico") || lower.includes("shock") || lower.includes("baton")) return "Shock Claws";
        if (lower.includes("morteiro") || lower.includes("mortar") || lower.includes("flak")) return "Mortar";
        if (lower.includes("desintegrador") || lower.includes("displacer")) return "Displacer";
        if (lower.includes("ferroa") || lower.includes("spike") || lower.includes("prego") || lower.includes("nail")) return "Bolt Thrower";
        if (lower.includes("lança") || lower.includes("lance") || lower.includes("pike")) return "War Pike";
        if (lower.includes("fusion")) return "Plasma Torch";

        return ""; // Sem sugestão padrão
    };

    // 4. Montar a interface HTML premium em estilo moderno e responsivo
    let html = `
    <div style="font-family: 'Outfit', 'Inter', sans-serif; padding: 5px;">
        <p style="margin-bottom: 15px; color: #a1a1aa; font-size: 13px; line-height: 1.5;">
            Selecione um efeito visual para cada arma de NPC detectada. O sistema realizou sugestões automáticas baseadas em heurísticas de nomes. Mantenha <strong>"Nenhum (Ignorar)"</strong> se preferir usar os efeitos padrões ou não queira adicionar efeitos adicionais.
        </p>
        <div style="max-height: 480px; overflow-y: auto; padding-right: 5px; border: 1px solid #3f3f46; border-radius: 8px; background: rgba(24, 24, 27, 0.6); backdrop-filter: blur(8px);">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 13px;">
                <thead>
                    <tr style="border-bottom: 2px solid #3f3f46; background: rgba(39, 39, 42, 0.8); position: sticky; top: 0; z-index: 10;">
                        <th style="padding: 10px;">Arma</th>
                        <th style="padding: 10px;">Lancer ID (LID)</th>
                        <th style="padding: 10px; width: 220px;">Efeito Visual (FX)</th>
                    </tr>
                </thead>
                <tbody>
    `;

    npcWeapons.forEach((wpn, idx) => {
        // Verificar se já existe um mapeamento customizado para esta LID
        const existingMapping = Object.values(currentEffects).find(eff => eff.itemLid === wpn.lid);
        const currentMacroUuid = existingMapping?.macroUuid || "";

        // Tentar heurística de sugestão se não houver mapeamento existente
        let suggestedMacroName = "";
        let suggestedMacroUuid = "";
        if (!currentMacroUuid) {
            suggestedMacroName = getSuggestedMacro(wpn.name);
            if (suggestedMacroName) {
                const found = fxMacros.find(m => m.name.toLowerCase() === suggestedMacroName.toLowerCase());
                if (found) suggestedMacroUuid = found.uuid;
            }
        }

        html += `
            <tr style="border-bottom: 1px solid #27272a; transition: background 0.2s;" onmouseover="this.style.background='rgba(63, 63, 70, 0.2)'" onmouseout="this.style.background='transparent'">
                <td style="padding: 8px 10px; display: flex; align-items: center; gap: 8px;">
                    <img src="${wpn.img}" style="width: 28px; height: 28px; border: 1px solid #52525b; border-radius: 4px; object-fit: cover; background: #18181b;" />
                    <span style="font-weight: 600; color: #f4f4f5;">${wpn.name}</span>
                </td>
                <td style="padding: 8px 10px; font-family: monospace; color: #a1a1aa; font-size: 11px;">
                    ${wpn.lid}
                </td>
                <td style="padding: 8px 10px;">
                    <select name="weapon-fx-${idx}" data-lid="${wpn.lid}" data-name="${wpn.name}" style="width: 100%; padding: 4px 8px; border-radius: 4px; border: 1px solid #52525b; background: #27272a; color: #f4f4f5; font-size: 12px; cursor: pointer;">
                        <option value="">-- Nenhum (Ignorar) --</option>
                        ${fxMacros.map(m => {
                            const isSelected = currentMacroUuid === m.uuid || (!currentMacroUuid && suggestedMacroUuid === m.uuid);
                            return `<option value="${m.uuid}" ${isSelected ? "selected" : ""}>${m.name}</option>`;
                        }).join("")}
                    </select>
                </td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    </div>
    `;

    // 5. Exibir a janela de diálogo interativa do Foundry VTT
    new Dialog({
        title: `Lancer Weapon FX | Mapeador de Armas de NPCs`,
        content: html,
        buttons: {
            save: {
                icon: '<i class="fas fa-save"></i>',
                label: 'Salvar Mapeamentos',
                callback: async (html) => {
                    const selects = html.find('select[name^="weapon-fx-"]');
                    const newEffects = { ...currentEffects };

                    // Mapeamento dos selects
                    selects.each(function() {
                        const select = $(this);
                        const lid = select.attr('data-lid');
                        const name = select.attr('data-name');
                        const macroUuid = select.val();

                        // Encontrar chave de efeito existente para esta LID
                        const existingKey = Object.keys(newEffects).find(k => newEffects[k].itemLid === lid);

                        if (macroUuid) {
                            // Criar ou atualizar mapeamento
                            const effectData = {
                                macroUuid: macroUuid,
                                folderId: null,
                                mode: 2, // CUSTOM_EFFECT_MODE_LID
                                itemName: name,
                                itemLid: lid
                            };

                            if (existingKey) {
                                newEffects[existingKey] = effectData;
                            } else {
                                // Gerar ID único para a nova entrada
                                const newId = foundry.utils.randomID();
                                newEffects[newId] = effectData;
                            }
                        } else if (existingKey) {
                            // Se o usuário removeu o efeito, deletar o mapeamento antigo
                            delete newEffects[existingKey];
                        }
                    });

                    // Atualizar a configuração global do módulo com os novos dados
                    await game.settings.set(MODULE_ID, SETTING_EFFECTS_MANAGER_STATE, {
                        effects: newEffects,
                        folders: currentState.folders || {}
                    });

                    ui.notifications.info(`Mapeamento atualizado com sucesso! Os efeitos das armas de NPCs agora estão ativos.`);
                }
            },
            cancel: {
                icon: '<i class="fas fa-times"></i>',
                label: 'Cancelar'
            }
        },
        default: 'save'
    }, {
        width: 720,
        height: 600,
        resizable: true
    }).render(true);
})();
