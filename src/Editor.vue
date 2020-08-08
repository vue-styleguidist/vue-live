<template>
  <PrismEditor
    v-model="stableCode"
    @input="updatePreview"
    :highlight="highlighter"
    v-bind="editorProps"
  />
</template>

<script>
import { PrismEditor } from "vue-prism-editor";

import {
  highlight as prismHighlight,
  languages,
} from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";

import debounce from "debounce";
import getScript from "./utils/getScript";

const UPDATE_DELAY = 300;

const highlight = (lang, jsxInExamples) => {
  if (lang === "vsg") {
    return (code) => {
      if (!code) {
        return "";
      }
      const scriptCode = getScript(code, jsxInExamples);
      const scriptCodeHighlighted = prismHighlight(
        scriptCode,
        languages[jsxInExamples ? "jsx" : "js"],
        lang
      );
      if (code.length === scriptCode.length) {
        return scriptCodeHighlighted;
      }
      const templateCode = code.slice(scriptCode.length);
      return (
        scriptCodeHighlighted +
        prismHighlight(templateCode, languages["html"], lang)
      );
    };
  } else {
    const langScheme = languages[lang];
    return (code) => prismHighlight(code, langScheme, lang);
  }
};

export default {
  name: "VueLiveEditor",
  components: { PrismEditor },
  props: {
    code: {
      type: String,
      required: true,
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
  },
  data() {
    return {
      updatePreview: () => {},
      /**
       * this data only gets changed when changing language.
       * it allows for copy and pasting without having the code
       * editor repainted every keystroke
       */
      stableCode: this.code,
    };
  },
  methods: {
    highlighter(code) {
      return highlight(this.prismLang, this.jsx)(code);
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
