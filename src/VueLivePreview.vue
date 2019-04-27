<template>
  <div class="preview-code">
    <codemirror
      v-model="model"
      :options="defaultOptions"
      @input="change"
    />
    <Preview
      :key="codeKey"
      :code="model"
    />
  </div>
</template>
<script>
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/vue/vue.js'
import { codemirror } from 'vue-codemirror'
import Preview from './Preview'
import hash from 'hash-sum'

export default {
  name: 'VueLivePreview',
  components: { codemirror, Preview },
  props: {
    code: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      model: this.code,
      codeKey: hash(this.code),
      defaultOptions: {
        theme: 'default',
        tabSize: 2,
        lineNumbers: true,
        mode: 'text/x-vue'
      }
    }
  },
  methods: {
    change(code) {
      this.codeKey = hash(code)
    }
  }
}
</script>
