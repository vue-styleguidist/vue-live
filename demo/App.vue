<template>
  <VueLivePreview :code="code" />
</template>
<script>
// eslint-disable-next-line import/no-webpack-loader-syntax
import code from '!!raw-loader!./Button.vue'

export default {
  name: 'PreviewDemo',
  data() {
    return {
      code
    }
  }
}
</script>
