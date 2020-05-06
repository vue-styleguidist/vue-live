<template>
  <main style="text-align: center;">
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
      <VueLive
        :editorProps="{ lineNumbers: true }"
        :code="codeTemplate"
        :layout="CustomLayout"
        :components="registeredComponents"
        @error="(e) => log('Error on first example', e)"
      />
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
      <h2>Pure JavaScript code</h2>
      <p>Or if you prefer to, use the <b>new Vue()</b> format</p>
      <VueLive :code="codeJs" :layout="CustomLayout" />
      <h2>
        Extra dependencies
      </h2>
      <p>
        Use the <b>requires</b> prop to make libraries and packages available in
        the browser
      </p>
      <VueLive
        :code="codeChicago"
        :layout="CustomLayout"
        :requires="chicagoRequires"
      />
      <h2>Custom delay</h2>
      <p>
        when updates should not hapen too often, for instance when a component
        need a lot of computing power to render, One can change the standard
        throttle timing.
      </p>
      <VueLive
        :code="`<input type='button' value='update me' />`"
        :layout="CustomLayout"
        :delay="2000"
      />

      <h2>Default Layout</h2>
      <div style="width: 950px; max-width: 95vw; margin: 20px auto;">
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
        <VueLive
          :code="`<input type='button' value='I am Groot' />`"
          :layout="CustomLayout"
        />
      </div>

      <h2>JSX</h2>
      <VueLive :code="realjsx" :layout="CustomLayout" :jsx="true" />

      <h2>Separate components for Editor and Preview</h2>
      <div class="separate">
        <div class="preview-separate">
          <VueLivePreview :code="separateCode" />
        </div>
        <hr style="width: 950px;" />
        <p>Edit the code here</p>
        <VueLiveEditor :code="separateCode" @change="updateCode" />
        <div class="button-bar"><button>Save</button></div>
      </div>
    </div>

    <github-corners
      url="https://github.com/vue-styleguidist/vue-live"
      gitColor="#FFFFFF"
    />
  </main>
</template>
<script>
import { VueLive, VueLiveEditor, VueLivePreview } from "../src";
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

import GithubCorners from "vue-github-corners";

export default {
  name: "VueLiveDemo",
  components: { VueLive, VueLiveEditor, VueLivePreview, GithubCorners },
  data() {
    return {
      registeredComponents: { DatePicker },
      codeSfc,
      codeTemplate,
      codeJs,
      codeChicago,
      CustomLayout,
      chicagoRequires: { "./chicagoNeighbourhoods": all },
      realjsx,
      separateCode: codeSfc,
      openExamples: false,
    };
  },
  methods: {
    updateCode(code) {
      this.separateCode = code;
    },
    log() {
      console.log(...arguments);
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap");

body {
  font-family: "Roboto Mono", monospace;
  background-color: #ded;
}

body .prism-editor__line-numbers {
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
  border-radius: 0 10px 10px 0;
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
