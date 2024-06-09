import {bindHooks as bindApiHooks} from "./api.js";
import {bindHooks as bindSettingsHooks} from "./settings.js";
import {bindHooks as bindPreloaderHooks} from "./preloader.js";
import {bindHooks as bindFlowListenerHooks} from "./flow/flowListener.js";

bindSettingsHooks();
bindApiHooks();
bindPreloaderHooks();
bindFlowListenerHooks();
