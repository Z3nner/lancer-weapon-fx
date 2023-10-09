class ModuleApi {
	static getEffectVolume(volume) {
		return volume * game.settings.get("lancer-weapon-fx", "volume");
	}
}

Hooks.on("init", () => game.modules.get("lancer-weapon-fx").api = ModuleApi);
