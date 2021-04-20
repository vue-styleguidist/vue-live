import VueLive from "./VueLive.vue";
import VueLivePreview from "./Preview.vue";
import VueLiveEditor from "./Editor.vue";

// Export components individually
export { VueLive };
export { VueLivePreview };
export { VueLiveEditor };

// What should happen if the user installs the library as a plugin
export function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component("VueLive", VueLive);
  Vue.component("VueLivePreview", VueLivePreview);
  Vue.component("VueLiveEditor", VueLiveEditor);
}

// Create module definition for Vue.use(plugin)
const plugin = {
  install,
};

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null;
if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

// Export the library as a plugin
export default plugin;
