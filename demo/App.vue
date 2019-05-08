<template>
  <main style="text-align:center;">
    <h1>Vue Live renders vue code directly in the browser</h1>
    <a
      href="https://github.com/vue-styleguidist/vue-live/tree/master/demo"
    >Check out the source for this demo</a>
    <h2>With imported components</h2>
    <VueLive :code="codeTemplate" :layout="CustomLayout" :components="registeredComponents"/>
    <h2>Display Single File Components</h2>
    <VueLive :code="codeSfc" :layout="CustomLayout"/>
    <h2>Pure JavaScript code</h2>
    <VueLive :code="codeJs" :layout="CustomLayout"/>
    <h2>Use the requires prop to make libraries and packages available in the browser</h2>
    <VueLive :code="codeChicago" :layout="CustomLayout" :requires="chicagoRequires"/>
    <h2>Default Layout</h2>
    <VueLive :code="`<input type='button' value='I am Groot'>`"/>
    <link href="https://fonts.googleapis.com/css?family=Roboto+Mono" rel="stylesheet">
  </main>
</template>
<script>
import VueLive from "../src/VueLive";
import CustomLayout from "./CustomLayout";
import DatePicker from "vuejs-datepicker";
// eslint-disable-next-line import/no-webpack-loader-syntax
import codeSfc from "!!raw-loader!./assets/Button.vue";
import codeJs from "!!raw-loader!./assets/input.js";
import codeTemplate from "!!raw-loader!./assets/PureTemplate.html";
import codeChicago from "!!raw-loader!./assets/Chicago.jsx";
import all from "./assets/chicagoNeighbourhoods";

export default {
  name: "VueLiveDemo",
  components: { VueLive },
  data() {
    return {
      registeredComponents: { DatePicker },
      codeSfc,
      codeTemplate,
      codeJs,
      codeChicago,
      CustomLayout,
      chicagoRequires: { chicagoNeighbourhoods: all }
    };
  }
};
</script>
<style>
body {
  font-family: "Roboto Mono", monospace;
  background-color: #ded;
}

body .prism-editor__line-numbers {
  box-sizing: border-box;
}
</style>
