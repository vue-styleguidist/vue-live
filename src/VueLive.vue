<template>
  <component :is="layout ? layout : VueLiveDefaultLayout" :code="stableCode" :language="prismLang">
    <template v-slot:editor>
      <PrismEditor v-model="stableCode" @change="updatePreview" :language="prismLang" />
    </template>
    <template v-slot:preview>
      <Preview
        :key="codeKey"
        :code="model"
        @detect-language="switchLanguage"
        :components="components"
        :requires="requires"
        :jsx="jsx"
      />
    </template>
  </component>
</template>
<script>
//load prism somewhere
import "prismjs";
import "prismjs/components/prism-jsx.min";

import PrismEditor from "vue-prism-editor";
import hash from "hash-sum";
import debounce from "debounce";

import Preview from "./Preview.vue";
import VueLiveDefaultLayout from "./VueLiveDefaultLayout.vue";

const LANG_TO_PRISM = {
  vue: "html",
  js: "jsx"
};

const UPDATE_DELAY = 300;

export default {
  name: "VueLivePreview",
  components: { PrismEditor, Preview },
  props: {
    /**
     * code rendered in the preview and the editor
     */
    code: {
      type: String,
      required: true
    },
    /**
     * Layout vue component with 2 slots named `editor` & `preview`
     */
    layout: {
      type: Object,
      default: undefined
    },
    /**
     * Hashtable of auto-registered components
     * @example { DatePicker: VueDatePicker }
     * @example { VueDatePicker }
     */
    components: {
      type: Object,
      default: () => {}
    },
    /**
     * Hashtable of modules available in require and import statements
     * in the Preview component
     * @example { lodash: require("lodash") }
     * @example { moment: require("moment") }
     */
    requires: {
      type: Object,
      default: () => {}
    },
    /**
     * Time in ms debouncing updates to the preview
     */
    delay: {
      type: Number,
      default: UPDATE_DELAY
    },
    /**
     * Do the code contain JSX rendered functions
     */
    jsx: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      model: this.code,
      prismLang: "html",
      VueLiveDefaultLayout,
      updatePreview: () => {},
      /**
       * this data only gets changed when changing language.
       * it allows for copy and pasting without having the code
       * editor repainted every keystroke
       */
      stableCode: this.code
    };
  },
  beforeMount() {
    this.updatePreview = debounce(value => {
      this.model = value;
    }, this.delay);
  },
  computed: {
    codeKey() {
      return hash(this.model);
    }
  },
  watch: {
    code(newCode) {
      this.stableCode = newCode;
      this.model = newCode;
    }
  },
  methods: {
    switchLanguage(newLang) {
      const newPrismLang = LANG_TO_PRISM[newLang];
      if (this.prismLang !== newPrismLang) {
        this.prismLang = newPrismLang;
        this.stableCode = this.model;
      }
    }
  }
};
</script>
