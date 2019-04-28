<template>
  <VueLive :code="code"/>
</template>
<script>
// eslint-disable-next-line import/no-webpack-loader-syntax
import { VueLive } from "../src";
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
