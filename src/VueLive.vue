<template>
  <VueLiveLayout>
    <template v-slot:editor>
      <PrismEditor :code="model" @change="updatePreview" :language="prismLang" :lineNumbers="true"/>
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
  </VueLiveLayout>
</template>
<script>
//load prism somewhere
import "prismjs";
import "prismjs/themes/prism-tomorrow.css";
//vue-prism-editor dependency
import "vue-prism-editor/dist/VuePrismEditor.css";
import "prismjs/components/prism-jsx.min";

import PrismEditor from "vue-prism-editor";
import hash from "hash-sum";
import debounce from "lodash.debounce";

import Preview from "./Preview.vue";
import VueLiveLayout from "./VueLiveDefaultLayout.vue";

const LANG_TO_PRISM = {
  vue: "html",
  js: "jsx"
};

export default {
  name: "VueLivePreview",
  components: { PrismEditor, Preview, VueLiveLayout },
  props: {
    code: {
      type: String,
      required: true
    },
    layout: {
      type: Object,
      default: undefined
    },
    components: {
      type: Object,
      default: () => {}
    },
    requires: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      model: this.code,
      prismLang: "html"
    };
  },
  created() {
    if (this.layout) {
      this.$options.components.VueLiveLayout = this.layout;
    }
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
