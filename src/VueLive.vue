<template>
  <VueLiveLayout>
    <template v-slot:editor>
      <PrismEditor v-model="model" language="html"/>
    </template>
    <template v-slot:preview>
      <Preview :key="codeKey" :code="model"/>
    </template>
  </VueLiveLayout>
</template>
<script>
//load prism somewhere
import "prismjs";
import "prismjs/themes/prism-tomorrow.css";
//vue-prism-editor dependency
import "vue-prism-editor/dist/VuePrismEditor.css";

import PrismEditor from "vue-prism-editor";
import Preview from "./Preview";
import VueLiveLayout from "./VueLiveDefaultLayout";
import hash from "hash-sum";

export default {
  name: "VueLivePreview",
  components: { PrismEditor, Preview, VueLiveLayout },
  props: {
    code: {
      type: String,
      required: true
    },
    layout: {
      type: Object
    }
  },
  data() {
    return {
      model: this.code
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
  }
};
</script>
