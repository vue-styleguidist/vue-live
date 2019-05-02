<template>
  <main style="text-align:center;">
    <h1>Vue Live renders vue code directly in the browser</h1>
    <h2>Display Single File Components</h2>
    <VueLive :code="codeSfc" :layout="CustomLayout"/>
    <h2>Try using templates</h2>
    <VueLive :code="codeTemplate" :layout="CustomLayout"/>
    <h2>Pure JavaScript code</h2>
    <VueLive :code="codeJs" :layout="CustomLayout"/>
    <h2>and even a weird hybrid format</h2>
  </main>
</template>
<script>
import VueLive from "../src/VueLive";
import CustomLayout from "./CustomLayout";
// eslint-disable-next-line import/no-webpack-loader-syntax
import codeSfc from "!!raw-loader!./assets/Button.vue";
import codeJs from "!!raw-loader!./assets/input.js";
import codeTemplate from "!!raw-loader!./assets/PureTemplate.html";

export default {
  name: "VueLiveDemo",
  components: { VueLive },
  data() {
    return {
      codeSfc,
      codeTemplate,
      codeJs,
      CustomLayout
    };
  }
};
</script>
