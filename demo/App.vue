<template>
  <div>
    <VueLive :code="codeSfc" :layout="CustomLayout"/>
    <VueLive :code="codeTemplate" :layout="CustomLayout"/>
  </div>
</template>
<script>
import VueLive from "../src/VueLive";
import CustomLayout from "./CustomLayout";
// eslint-disable-next-line import/no-webpack-loader-syntax
import codeSfc from "!!raw-loader!./assets/Button.vue";
import codeTemplate from "!!raw-loader!./assets/PureTemplate.html";

export default {
  name: "VueLiveDemo",
  components: { VueLive },
  data() {
    return {
      codeSfc,
      codeTemplate,
      CustomLayout
    };
  }
};
</script>
