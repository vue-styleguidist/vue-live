<template>
  <main style="text-align: center">
		<VueLive :editorProps="{ lineNumbers: true }" :code="codeTemplate" :layout="CustomLayout"
		  :components="registeredComponents" @error="(e: any) => log('Error on first example', e)" />

    <github-corners href="https://github.com/vue-styleguidist/vue-live" gitColor="#FFFFFF" />
  </main>
</template>
<script lang="ts">
import { defineComponent, markRaw } from "vue";
import DatePicker from "vue3-datepicker";
import { VueLive, VueLiveEditor, VueLivePreview } from "../src";
import CustomLayout from "./CustomLayout.vue";
import codeSfc from "./assets/Button.vue?raw";
import codeSfcSetup from "./assets/ButtonSetup.vue?raw";
import codeJs from "./assets/input.js?raw";
import realjsx from "./assets/real.jsx?raw";
import codeTemplate from "./assets/PureTemplate.html?raw";
import doubleRoot from "./assets/PureTemplateDoubleRoot.html?raw";
import codeChicago from "./assets/Chicago.jsx?raw";
import all from "./assets/chicagoNeighbourhoods";
import "prismjs/themes/prism-tomorrow.css";
import "vue3-datepicker/dist/vue3-datepicker.css";

// @ts-ignore
import GithubCorners from "@uivjs/vue-github-corners";

export default defineComponent({
  name: "VueLiveDemo",
  components: { VueLive, VueLiveEditor, VueLivePreview, GithubCorners },
  data() {
    return {
      registeredComponents: { DatePicker: markRaw(DatePicker) },
      codeSfc,
			codeSfcSetup,
      codeTemplate,
      codeJs,
      codeChicago,
      CustomLayout: markRaw(CustomLayout),
      chicagoRequires: { "./chicagoNeighbourhoods": all },
      realjsx,
      separateCode: codeSfc,
      doubleRoot,
      openExamples: false,
      error: undefined,
    };
  },
  methods: {
    updateCode(code: string) {
      this.separateCode = code;
    },
    log(...args: any[]) {
      console.log(...args);
    },
  },
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap");

body {
  font-family: "Roboto Mono", monospace;
  background-color: #ded;
}

.prism-editor-wrapper {
  background-color: #222;
  color: #eee;
  padding: 8px 12px;
  box-sizing: border-box;
}

.separate {
  display: flex;
  flex-direction: column;
  width: 950px;
  margin: 30px auto;
}

.preview-separate {
  padding: 30px;
  background-color: #fff;
  text-align: center;
  border-radius: 10px 10px 0 0;
}

.description {
  max-width: 600px;
  margin: 30px auto;
  text-align: left;
}

.livebox {
  position: relative;
  max-width: 950px;
  margin: auto;
}

.hint {
  position: absolute;
  top: 100px;
  left: -200px;
  font-family: "Nanum Pen Script";
  font-size: 2em;
  color: red;
  transform: rotate(-30deg);
  transition: transform 0.2s;
}

@media (max-width: 1400px) {
  .hint {
    transform: none;
    top: -35px;
    left: 0;
  }

  .hint span {
    transform: rotate(80deg) translate(10px, 10px);
    display: inline-block;
  }

  .separate {
    width: 90vw;
  }
}

.button-bar {
  height: 70px;
  padding: 5px 0;
  text-align: left;
}

.button-bar button {
  font-size: 1.5em;
  padding: 6px;
  border-radius: 8px;
  width: 200px;
}
</style>
