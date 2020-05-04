<template>
  <div>
    <pre :class="$style.error" v-if="error">{{ this.error }}</pre>
    <component
      v-if="!error && previewedComponent"
      :id="scope"
      :is="previewedComponent"
      :key="iteration"
    />
  </div>
</template>

<script>
import Vue from "vue";
import {
  compile,
  isCodeVueSfc,
  addScopedStyle,
  adaptCreateElement,
  concatenate,
} from "vue-inbrowser-compiler";
import evalInContext from "./utils/evalInContext";
import requireAtRuntime from "./utils/requireAtRuntime";

const errorDelimiter = "VueLivePreview";

let globalIterator = 0;

const existingWarnHandler =
  Vue.config.warnHandler ||
  ((msg, vm, trace) => {
    if (console) {
      console.error("[Vue warn]: " + msg + trace);
    }
  });

function captureTemplateWarning(msg, vm) {
  if (vm.$parent && vm.$parent.$options.errorDelimiter === errorDelimiter) {
    vm.$parent._data.error = `Warning in template: ${msg}`;
  }
  existingWarnHandler(...arguments);
}

function setupWarningHandler() {
  if (Vue.config.warnHandler !== captureTemplateWarning) {
    Vue.config.warnHandler = captureTemplateWarning;
  }
}

export default {
  name: "VueLivePreviewComponent",
  errorDelimiter,
  components: {},
  errorCaptured(err) {
    err.message = `Error in template: ${err.message}`;
    this.handleError(err);
  },
  props: {
    /**
     * code rendered
     */
    code: {
      type: String,
      required: true,
    },
    /**
     * Hashtable of auto-registered components
     * @example { DatePicker: VueDatePicker }
     * @example { VueDatePicker }
     */
    components: {
      type: Object,
      default: () => {},
    },
    /**
     * Hashtable of modules available in require and import statements
     * in the code prop
     * @example { lodash: require("lodash") }
     * @example { moment: require("moment") }
     */
    requires: {
      type: Object,
      default: () => {},
    },
    jsx: {
      type: Boolean,
      default: false,
    },
    /**
     * Outside data to the preview
     * @example { count: 1 }
     */
    dataScope: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      scope: this.generateScope(),
      previewedComponent: undefined,
      iteration: 0,
      error: false,
    };
  },
  created() {
    this.renderComponent(this.code.trim());
    setupWarningHandler();
  },
  watch: {
    code(value) {
      this.renderComponent(value.trim());
    },
  },
  methods: {
    /**
     * Generates the Scope Id attribute value. It will be added to each
     * tag if a style is applied to scope the style only to this example
     */
    generateScope() {
      return "v-xxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    handleError(e) {
      this.$emit("error", e);
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
              (filepath) => requireAtRuntime(this.requires, filepath),
              adaptCreateElement,
              concatenate
            ) || {};

          if (this.dataScope) {
            const mergeData = { ...data.data(), ...this.dataScope };
            data.data = () => mergeData;
          }
        }
        if (renderedComponent.template) {
          // if this is a pure template or if we are in hybrid vsg mode,
          // we need to set the template up.
          data.template = `<div key="${globalIterator++}">${
            renderedComponent.template
          }</div>`;
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
        this.iteration = this.iteration + 1;
      } else {
        this.handleError({
          message:
            "[Vue Live] no template or render function specified, you might have an issue in your example",
        });
      }
    },
  },
};
</script>

<style module>
.error {
  color: red;
  text-align: left;
  overflow: auto;
  white-space: pre-wrap;
}
</style>
