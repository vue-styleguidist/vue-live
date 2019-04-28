import VueLive from "./VueLive.vue";

// Export components individually
export { VueLive };

// What should happen if the user installs the library as a plugin
function install(Vue) {
  Vue.component("VueLive", VueLive);
}

// Export the library as a plugin
export default { install: install };
