<template>
  <main style="text-align:center;">
    <h1>Vue Live renders vue code directly in the browser</h1>
    <a
      href="https://github.com/vue-styleguidist/vue-live/tree/master/demo"
    >Check out the source for this demo</a>
    <h2>With imported components and the code-editor lineNumers</h2>
    <VueLive :editorProps="{lineNumbers: true}" :code="codeTemplate" :layout="CustomLayout" :components="registeredComponents" />
    <h2>Display Single File Components</h2>
    <VueLive :code="codeSfc" :layout="CustomLayout" />
    <h2>Pure JavaScript code</h2>
    <VueLive :code="codeJs" :layout="CustomLayout" />
    <h2>Use the requires prop to make libraries and packages available in the browser</h2>
    <VueLive :code="codeChicago" :layout="CustomLayout" :requires="chicagoRequires" />
    <h2>With a custom update delay of 2 seconds</h2>
    <VueLive
      :code="`<input type='button' value='update me' />`"
      :layout="CustomLayout"
      :delay="2000"
    />
    <h2>Default Layout</h2>
    <div style="width:950px; max-width:95vw; margin:20px auto;">
      <VueLive :code="`<input type='button' value='I am Groot' />`" />
    </div>
    <h2>Custom Layout</h2>
    <div>
      <p>Attributes available for custom layout:</p>
      <p>
        <code>code: String</code>,
        <code>language: String</code>,
        <code>components: Object</code>,
        <code>requires: Object</code>,
        ... all props passed in the
        <code>layoutProps</code>
      </p>
      <VueLive :code="`<input type='button' value='I am Groot' />`" :layout="CustomLayout" />
    </div>
    <h2>It even supports jsx</h2>
    <VueLive :code="realjsx" :layout="CustomLayout" :jsx="true" />
    <link href="https://fonts.googleapis.com/css?family=Roboto+Mono" rel="stylesheet" />
  </main>
</template>
<script>
import VueLive from "../src/VueLive";
import CustomLayout from "./CustomLayout";
import DatePicker from "vuejs-datepicker";
import codeSfc from "!!raw-loader!./assets/Button.vue";
import codeJs from "!!raw-loader!./assets/input.js";
import realjsx from "!!raw-loader!./assets/real.jsx";
import codeTemplate from "!!raw-loader!./assets/PureTemplate.html";
import codeChicago from "!!raw-loader!./assets/Chicago.jsx";
import all from "./assets/chicagoNeighbourhoods";
import "prismjs/themes/prism-tomorrow.css";
//vue-prism-editor dependency
import "vue-prism-editor/dist/VuePrismEditor.css";

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
      chicagoRequires: { "./chicagoNeighbourhoods": all },
      realjsx
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
