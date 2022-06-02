<template>
  <PrismEditor
    v-model="stableCode"
    @update:modelValue="updatePreview"
    :highlight="highlighter"
    v-bind="editorProps"
  />
</template>

<script>
import { PrismEditor } from "vue-prism-editor";
import debounce from "debounce";

import "vue-prism-editor/dist/prismeditor.min.css";

import makeHighlight from "./utils/highlight";

const UPDATE_DELAY = 300;

export default {
  name: "VueLiveEditor",
  inheritAttrs: false,
  components: { PrismEditor },
  props: {
    code: {
      type: String,
      required: true,
    },
    error: {
      type: [Error, Object],
      default: undefined,
    },
    delay: {
      type: Number,
      default: UPDATE_DELAY,
    },
    editorProps: {
      type: Object,
      default: () => ({}),
    },
    prismLang: {
      type: String,
      default: "html",
      validator: (val) => ["html", "vsg"].includes(val),
    },
    jsx: {
      type: Boolean,
      default: false,
    },
    squiggles: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      updatePreview: () => {},
      /**
       * This data only gets changed when changing language.
       * it allows for copy and pasting without having the code
       * editor repainted every keystroke
       */
      stableCode: this.code,
      highlight: () => (code) => code,
    };
  },
  async beforeMount() {
    /**
     * To load the prism jsx language with ESmodules we need to
     * load javascript first then load jsx
     * order is not guaranteed to work in ESmodules imports
     */
    this.highlight = await makeHighlight()
  },
  methods: {
    highlighter(code) {
      return this.highlight(this.prismLang, this.jsx)(
        code,
        this.squiggles && this.error && this.error.loc
      );
    },
  },
  watch: {
    code(value) {
      this.updatePreview(value);
    },
  },
  created() {
    this.updatePreview = debounce((value) => {
      this.stableCode = value;
      this.$emit("change", value);
    }, this.delay);
  },
};
</script>

<style>
.VueLive-squiggles-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
}

.VueLive-squiggles {
  border-bottom: 2px dotted red;
}
</style>
