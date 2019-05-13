<template>
  <component :is="this.layout ? this.layout : VueLiveDefaultLayout">
    <template v-slot:editor>
      <PrismEditor :code="model" @change="updatePreview" :language="prismLang"/>
    </template>
    <template v-slot:preview>
      <Preview
        :key="codeKey"
        :code="model"
        @detect-language="switchLanguage"
        :components="components"
        :requires="requires"
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
import debounce from "lodash.debounce";

import Preview from "./Preview.vue";
import VueLiveDefaultLayout from "./VueLiveDefaultLayout.vue";

const LANG_TO_PRISM = {
  vue: "html",
  js: "jsx"
};

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
    }
  },
  data() {
    return {
      model: this.code,
      prismLang: "html",
      VueLiveDefaultLayout
    };
  },
  computed: {
    codeKey() {
      return hash(this.model);
    }
  },
  methods: {
    switchLanguage(newLang) {
      this.prismLang = LANG_TO_PRISM[newLang];
    },
    updatePreview: debounce(function(value) {
      this.model = value;
    }, 300)
  }
};
</script>
