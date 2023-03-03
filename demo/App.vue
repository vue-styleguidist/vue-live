<template>
  <main style="text-align: center">
    <h1>Vue Live renders vue code in the browser</h1>
    <p class="description">
      <em>vue-live</em> is a VueJs component. It renders the code passed in prop
      using the VueJs compiler - yes exactly like the vuejs compiler. But wait!
      it has a <b>super-power</b>! It keeps the rendered code reactive in the
      browser.
    </p>
    <p class="description">
      If you edit the code in the editor on the left, the preview on the right
      will update automatically.
    </p>

    <div class="livebox">
      <div class="hint">You can edit this <span>-></span></div>
      <VueLive :editorProps="{ lineNumbers: true }" :code="codeTemplate" :layout="CustomLayout"
        :components="registeredComponents" @error="(e: any) => log('Error on first example', e)" />
    </div>

    <span v-if="!openExamples">+</span><span v-else>-</span>&nbsp;
    <a href="#" @click="openExamples = !openExamples">More examples</a>
    <div v-if="openExamples">
      <h2>Vue SFC</h2>
      <p>
        If this format is not fitting for you, vue-live renders VueJs single
        file components as well
      </p>
      <VueLive :code="codeSfc" :layout="CustomLayout" />
			<h2>SFC with setup</h2>
      <VueLive :code="codeSfcSetup" :layout="CustomLayout" />
      <h2>Pure JavaScript code</h2>
      <p>Or if you prefer to, use the <b>new Vue()</b> format</p>
      <VueLive :code="codeJs" :layout="CustomLayout" />
      <h2>Extra dependencies</h2>
      <p>
        Use the <b>requires</b> prop to make libraries and packages available in
        the browser
      </p>
      <VueLive :code="codeChicago" :layout="CustomLayout" :requires="chicagoRequires" />
      <h2>Custom delay</h2>
      <p>
        When updates should not happen too often, for instance when a component
        need a lot of computing power to render, one can change the standard
        throttle timing.
      </p>
      <VueLive :code="`<input type='button' value='update me' />`" :layout="CustomLayout" :delay="2000" />

      <h2>Default Layout</h2>
      <div style="width: 950px; max-width: 95vw; margin: 20px auto">
        <VueLive :code="`<input type='button' value='I am Groot' />`" />
      </div>
      <h2>Custom Layout</h2>
      <div>
        <p>Attributes available for custom layout:</p>
        <p>
          <code>code: String</code>, <code>language: String</code>,
          <code>components: Object</code>, <code>requires: Object</code>, ...
          all props passed in the
          <code>layoutProps</code>
        </p>
        <VueLive :code="`<input type='button' value='I am Groot' />`" :layout="CustomLayout" />
      </div>

      <h2>JSX</h2>
      <VueLive :code="realjsx" :layout="CustomLayout" :jsx="true" />

      <h2>Double Root</h2>
      <VueLive :code="doubleRoot" :layout="CustomLayout" />

      <h2>Separate components for Editor and Preview</h2>
      <div class="separate">
        <div class="preview-separate">
          <VueLivePreview :code="separateCode" @error="(e: any) => (error = e)" @success="error = undefined" />
        </div>
        <hr style="width: 950px" />
        <p>Edit the code here</p>
        <VueLiveEditor :code="separateCode" @change="updateCode" :error="error" />
        <div class="button-bar"><button>Save</button></div>
      </div>
    </div>

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
