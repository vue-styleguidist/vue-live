<template>
  <div>
    <div style="color:red" v-if="error">{{this.error}}</div>
    <VuePreview :id="scope"/>
  </div>
</template>

<script>
import compileCode, { isCodeVueSfc } from "./utils/compileCode";
import getVars from "./utils/getVars";
import getVueConfigObject from "./utils/getVueConfigObject";
import addScopedStyle from "./utils/addScopedStyle";

export default {
  name: "VueLivePreviewComponent",
  components: {},
  props: {
    code: {
      type: String,
      required: true
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
      scope: this.generateScope(),
      error: false
    };
  },
  beforeMount() {
    this.renderComponent(this.code.trim());
  },
  methods: {
    generateScope() {
      return "v-xxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    handleError(e) {
      this.error = e.message;
    },
    renderComponent(code) {
      let data = {};
      let listVars = [];
      let script;
      let style;
      let template;
      try {
        const renderedComponent = compileCode(code);
        style = renderedComponent.style;
        if (renderedComponent.html && renderedComponent.script.length) {
          // When it's a template preceeded by a script (vsg format)
          // NOTA: if it is an SFC, the html template will be added in the script

          // extract all variable to set them up as data in the component
          // this way we can use in the template what is defined in the script
          listVars = getVars(renderedComponent.script);
        }
        if (renderedComponent.script) {
          // if the compiled code contains a script it might be "just" a script
          // if so, change scheme used by editor
          this.$emit("detect-language", isCodeVueSfc(code) ? "vue" : "js");

          // compile and execute the script
          // it can be:
          // - a script setting up variables => we set up the data property of renderedComponent
          // - a `new Vue()` script that will return a full config object
          script = renderedComponent.script;
          data = getVueConfigObject(script, listVars, this.requires) || {};
        }
        if (renderedComponent.html) {
          // if this is a pure template or if we are in hybrid vsg mode,
          // we need to set the template up.
          template = `<div>${renderedComponent.html}</div>`;
          data.template = template;
        }
      } catch (e) {
        this.handleError(e);
      }

      data.components = this.components;
      if (style) {
        // To add the scope id attribute to each item in the html
        // this way when we add the scoped style sheet it will be aplied
        data._scopeId = `data-${this.scope}`;
        addScopedStyle(style, this.scope);
      }

      this.$options.components.VuePreview = data;
    }
  }
};
</script>
