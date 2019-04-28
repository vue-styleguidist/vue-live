<template>
  <div class="preview-code" style="display:flex;">
    <PrismEditor style="flex-grow:1;width:auto;" v-model="model" language="html"/>
    <Preview :key="codeKey" style="padding:10px;flex-grow:1;" :code="model"/>
  </div>
</template>
<script>
//load prism somewhere
import "prismjs";
import "prismjs/themes/prism-tomorrow.css";
//vue-prism-editor dependency
import "vue-prism-editor/dist/VuePrismEditor.css";

import PrismEditor from "vue-prism-editor";
import Preview from "./Preview";
import hash from "hash-sum";

export default {
  name: "VueLivePreview",
  components: { PrismEditor, Preview },
  props: {
    code: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      model: this.code
    };
  },
  computed: {
    codeKey() {
      return hash(this.model);
    }
  }
};
</script>
