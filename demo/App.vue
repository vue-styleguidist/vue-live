<template>
  <VueLive :code="code"/>
</template>
<script>
import VueLive from "../src/VueLive";
// eslint-disable-next-line import/no-webpack-loader-syntax
import code from "!!raw-loader!./assets/Button.vue";

export default {
  name: "VueLiveDemo",
  components: { VueLive },
  data() {
    return {
      code
    };
  }
};
</script>
