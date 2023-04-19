<template>
  <PrismEditor :class="{'VueLive-LineNumbers': editorProps.lineNumbers}" v-model="stableCode" @update:modelValue="updatePreview" :highlight="highlighter" v-bind="editorProps" :lineNumbers="false"/>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { PrismEditor } from "vue-prism-editor";
import makeHighlight, { CONFIGURED_LANGS, type CONFIGURED_LANGS_TYPE } from "vue-inbrowser-prismjs-highlighter";
import debounce from "debounce";

import "vue-prism-editor/dist/prismeditor.min.css";


const UPDATE_DELAY = 300;

export default defineComponent({
  name: "VueLiveEditor",
  inheritAttrs: false,
  components: { PrismEditor },
  props: {
    code: {
      type: String,
      required: true,
    },
    error: {
      type: [Error, Object] as PropType<(Error | Object) & { loc: any }>,
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
      type: String as PropType<CONFIGURED_LANGS_TYPE>,
      default: "html",
      validator: (val: CONFIGURED_LANGS_TYPE) => CONFIGURED_LANGS.includes(val),
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
      updatePreview: (() => { }) as (code: string) => void,
      /**
       * This data only gets changed when changing language.
       * it allows for copy and pasting without having the code
       * editor repainted every keystroke
       */
      stableCode: this.code,
      highlight: (() => (code: string) => code) as Awaited<ReturnType<typeof makeHighlight>>,
    };
  },
  async beforeMount() {
    /**
     * To load the prism jsx language with ESmodules we need to
     * load javascript first then load jsx
     * order is not guaranteed to work in ESmodules imports
     */
    this.highlight = await makeHighlight('VueLive-LineNumbers');
  },
  methods: {
    highlighter(code: string) {
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
    this.updatePreview = debounce((value: string) => {
      this.stableCode = value;
      this.$emit("change", value);
    }, this.delay);
  },
});
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

.VueLive-LineNumbers.prism-editor-wrapper pre.prism-editor__editor,
.VueLive-LineNumbers.prism-editor-wrapper textarea.prism-editor__textarea {
  padding-left: 2.5rem;
}


.VueLive-LineNumbers pre.prism-editor__editor {
  counter-reset: step;
  counter-increment: step 0;
}

.VueLive-LineNumbers pre .line{
  position: relative;
}

.VueLive-LineNumbers pre .line::before {
  content: counter(step);
  counter-increment: step;
  white-space: nowrap;
  width: 2rem;
  position: absolute;
  left: -2.5rem;
  display: inline-block;
  text-align: right;
  color: rgba(255,255,255,.4)
}
</style>
