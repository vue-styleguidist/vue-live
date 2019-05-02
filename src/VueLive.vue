<template>
  <VueLiveLayout>
    <template v-slot:editor>
      <PrismEditor v-model="model" :language="prismLang"/>
    </template>
    <template v-slot:preview>
      <Preview
        :key="codeKey"
        :code="model"
        @detect-language="switchLanguage"
        :components="components"
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
import Preview from "./Preview";
import VueLiveLayout from "./VueLiveDefaultLayout";
import hash from "hash-sum";

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
    }
  }
};
</script>
