import VueLive from "./VueLive.vue";
import VueLivePreview from "./Preview.vue";

// Export components individually
export { VueLive };
export { VueLivePreview };

// What should happen if the user installs the library as a plugin
function install(Vue) {
  Vue.component("VueLive", VueLive);
  Vue.component("VueLivePreview", VueLivePreview);
}

// Export the library as a plugin
export default { install: install };
