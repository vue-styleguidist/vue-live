<template>
  <div>
    <div :id="scope" />
  </div>
</template>

<script>
import Vue from 'vue'
import { transform } from 'buble'
import compileCode from './utils/compileCode'
import getVars from './utils/getVars'
import getVueConfigObject from './utils/getVueConfigObject'
import styleScoper from './utils/styleScoper'

export default {
  name: 'VueLivePreviewComponent',
  props: {
    code: {
      type: String,
      required: true
    },
    scoped: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      scope: this.generateScope()
    }
  },
  mounted() {
    this.renderComponent(this.code.trim())
    Vue.config.errorHandler = error => console.warn(error)
    Vue.config.warnHandler = error => console.warn(error)
  },
  methods: {
    generateScope() {
      return 'v-xxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    },
    handleErrors(e){
      console.error(e)
    },
    renderComponent(code) {
      let data, script, style, template;
      let listVars = []
      try {
        const renderedComponent = compileCode(code)
        style = renderedComponent.style
        if (renderedComponent.html && renderedComponent.script.length) {
          // When it's a template preceeded by a script (vsg format)
          // NOTA: if it is an SFC, the html template will be added in the script

          // extract all variable to set them up as data in the component
          // this way we can use in the template what is defined in the script
          listVars = getVars(renderedComponent.script)
        }
        if (renderedComponent.script) {
          // compile and execute the script
          // it can be:
          // - a script setting up variables => we set up the data property of renderedComponent
          // - a `new Vue()` script that will return a full config object
          script = transform(renderedComponent.script).code
          data = getVueConfigObject(script, listVars) || {}
        }
        if (renderedComponent.html) {
          // if this is a pure template or if we are in hybrid vsg mode,
          // we need to set the template up.
          template = `<div>${renderedComponent.html}</div>`
          data.template = template
        }
      }catch(e){
        this.handleErrors(e)
      }


      // eslint-disable-next-line no-new
      const vueInstance = new Vue({
        el: `#${this.scope}`,
        render: createElement => createElement(data)
      });

      // Add the scoped style if there is any
      if (style) {
        const styleContainer = document.createElement('div')
        styleContainer.innerHTML = style
        styleContainer.firstChild.id = this.scope
        vueInstance.$el.appendChild(styleContainer.firstChild)
      }
      styleScoper()
    }
  }
}

</script>

<style scoped>
.previewCode {
  text-align: left;
}
</style>
