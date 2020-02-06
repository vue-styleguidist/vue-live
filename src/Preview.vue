<template>
  <div>
    <div style="color:red" v-if="error">{{this.error}}</div>
    <component v-if="!error && previewedComponent" :id="scope" :is="previewedComponent" />
  </div>
</template>

<script>
import {
  compile,
  isCodeVueSfc,
  addScopedStyle,
  adaptCreateElement,
  concatenate
} from "vue-inbrowser-compiler";
import evalInContext from "./utils/evalInContext";
import requireAtRuntime from "./utils/requireAtRuntime";

export default {
  name: "VueLivePreviewComponent",
  components: {},
  props: {
    /**
     * code rendered
     */
    code: {
      type: String,
      required: true
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
     * in the code prop
     * @example { lodash: require("lodash") }
     * @example { moment: require("moment") }
     */
    requires: {
      type: Object,
      default: () => {}
    },
    jsx: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scope: this.generateScope(),
      previewedComponent: undefined,
      error: false
    };
  },
  created() {
    this.renderComponent(this.code.trim());
  },
  methods: {
    /**
     * Generates the Scope Id attribute value. It will be added to each
     * tag if a style is applied to scope the style only to this example
     */
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
      let style;
      try {
        const renderedComponent = compile(
          code,
          this.jsx
            ? { jsx: "__pragma__(h)", objectAssign: "__concatenate__" }
            : {}
        );
        style = renderedComponent.style;
        if (renderedComponent.script) {
          // if the compiled code contains a script it might be "just" a script
          // if so, change scheme used by editor
          this.$emit("detect-language", isCodeVueSfc(code) ? "vue" : "js");

          // compile and execute the script
          // it can be:
          // - a script setting up variables => we set up the data property of renderedComponent
          // - a `new Vue()` script that will return a full config object
          const script = renderedComponent.script;
          data =
            evalInContext(
              script,
              filepath => requireAtRuntime(this.requires, filepath),
              adaptCreateElement,
              concatenate
            ) || {};
        }
        if (renderedComponent.template) {
          // if this is a pure template or if we are in hybrid vsg mode,
          // we need to set the template up.
          data.template = `<div>${renderedComponent.template}</div>`;
        }
      } catch (e) {
        this.handleError(e);
        return;
      }

      data.components = this.components;
      if (style) {
        // To add the scope id attribute to each item in the html
        // this way when we add the scoped style sheet it will be aplied
        data._scopeId = `data-${this.scope}`;
        addScopedStyle(style, this.scope);
      }

      if (data.template || data.render) {
        this.previewedComponent = data;
      } else {
        this.handleError({
          message:
            "[Vue Live] no template or render function specified, you might have an issue in your example"
        });
      }
    }
  }
};
</script>
