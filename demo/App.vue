<template>
  <VueLive :code="code" :layout="CustomLayout"/>
</template>
<script>
import VueLive from "../src/VueLive";
import CustomLayout from "./CustomLayout";
// eslint-disable-next-line import/no-webpack-loader-syntax
import code from "!!raw-loader!./assets/Button.vue";

export default {
  name: "VueLiveDemo",
  components: { VueLive },
  data() {
    return {
      code,
      CustomLayout
    };
  }
};
</script>
