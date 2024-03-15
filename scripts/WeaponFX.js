import {bindHooks as bindApiHooks} from "./api.js";
import {bindHooks as bindSettingsHooks} from "./settings.js";
import {bindHooks as bindPreloaderHooks} from "./preloader.js";
import {bindHooks as bindChatListenerHooks} from "./chatListener.js";

bindSettingsHooks();
bindApiHooks();
bindPreloaderHooks();
bindChatListenerHooks();
