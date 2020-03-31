<template>
  <PrismEditor
    v-model="stableCode"
    :language="prismLang"
    @change="updatePreview"
    v-bind="editorProps"
  />
</template>

<script>
//load prism somewhere
import "prismjs";
import "prismjs/components/prism-jsx.min";

import PrismEditor from "vue-prism-editor";
import debounce from "debounce";

const UPDATE_DELAY = 300;

export default {
  name: 'VueLiveEditor',
  components: { PrismEditor },
  props: {
    code: {
      type: String,
      required: true
    },
    delay: {
      type: Number,
      default: UPDATE_DELAY
    },
    editorProps: {
      type: Object,
      default: () => ({})
    },
    prismLang: {
      type: String,
      default: 'html'
    }
  },
  data() {
    return {
      updatePreview: () => {},
      /**
       * this data only gets changed when changing language.
       * it allows for copy and pasting without having the code
       * editor repainted every keystroke
       */
      stableCode: this.code
    }
  },
  watch: {
    code(value) {
      this.updatePreview(value);
    }
  },
  created() {
    this.updatePreview = debounce(value => {
      this.stableCode = value;

      this.$emit('change', value);
    }, this.delay)
  }
}
</script>
