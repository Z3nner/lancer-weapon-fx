import { bindHooks as bindApiHooks } from "./api.js";
import { bindHooks as bindSettingsHooks } from "./settings.js";
import { bindHooks as bindModuleCheckHooks } from "./moduleCheck.js";
import { bindHooks as bindFlowListenerHooks } from "./flow/flowListener.js";
import { bindHooks as bindManagerHooks } from "./effectManager/effectManager.js";

bindSettingsHooks();
bindApiHooks();
bindModuleCheckHooks();
bindFlowListenerHooks();
bindManagerHooks();
