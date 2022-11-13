<template>
  <pre class="VueLive-error" v-if="error">{{ error }}</pre>
  <component v-else-if="previewedComponent" :is="previewedComponent" :key="iteration" />
</template>

<script lang="ts">
import { markRaw, h, defineComponent } from "vue";
import * as Vue from "vue";
import {
  compile as compileScript,
  isCodeVueSfc,
  addScopedStyle,
  adaptCreateElement,
  concatenate,
  compileTemplateForEval
} from "vue-inbrowser-compiler-sucrase";
import checkTemplate, {
  VueLiveParseTemplateError,
} from "./utils/checkTemplate";
import evalInContext from "./utils/evalInContext";
import requireAtRuntime from "./utils/requireAtRuntime";

export default defineComponent({
  name: "VueLivePreviewComponent",
  emits: ["error", "success", "detect-language"],
  components: {},
  errorCaptured(err) {
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
      default: () => { },
    },
    /**
     * Hashtable of modules available in require and import statements
     * in the code prop
     * @example { lodash: require("lodash") }
     * @example { moment: require("moment") }
     */
    requires: {
      type: Object,
      default: () => { },
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
      default: () => { },
    },
    /**
     * Avoid checking variables for availability it template
     */
    checkVariableAvailability: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      scope: this.generateScope(),
      previewedComponent: {},
      iteration: 0,
      error: false,
      removeScopedStyle: () => { },
    };
  },
  computed: {
    requiresPlusVue() {
      return { vue: Vue, ...this.requires };
    },
  },
  created() {
    this.renderComponent(this.code.trim());
  },
  destroyed() {
    this.removeStyle();
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
    handleError(e: any) {
      /**
       * Emitted every time the component rendered throws an error
       * Catches runtime and compilation errors
       * @event
       * @property { Error } - the error thrown
       */
      if (e.constructor === VueLiveParseTemplateError) {
        e.message = `Cannot parse template expression: ${JSON.stringify(
          (e.expression as any).content || e.expression
        )}\n\n${e.message}`;
      }
      this.$emit("error", e);
      this.error = e.message;
    },
    removeStyle() {
      if (this.removeScopedStyle) {
        this.removeScopedStyle();
      }
    },
    renderComponent(code: string) {
      let options: Record<string, any> = {};
      let style;
      try {
        const renderedComponent = compileScript(
          code,
          this.jsx
            ? {
              jsxPragma: "__pragma__(h)",
            } : {}
        );
        style = renderedComponent.style;
        if (renderedComponent.script) {
          // if the compiled code contains a script it might be "just" a script
          // if so, change scheme used by editor
          // NOTE: vsg is a superset of JavaScript allowing
          // the template to succeed literally code, very useful for examples
          // NOTE2: vsg stands for vue-styleguidist
          this.$emit("detect-language", isCodeVueSfc(code) ? "vue" : "vsg");

          // compile and execute the script
          // it can be:
          // - a script setting up variables => we set up the data property of renderedComponent
          // - a `new Vue()` script that will return a full config object
          const calcOptions = () => {
            const script = renderedComponent.script;
            options = (evalInContext(
              script,
              (filepath) => requireAtRuntime(this.requiresPlusVue, filepath),
              adaptCreateElement,
              concatenate,
              h
            ) || {}) as Record<string, any>;
            if (options.render) {
              const preview = this;
              const originalRender = options.render;
              options.render = function (...args: any[]) {
                try {
                  return originalRender.call(this, ...args);
                } catch (e) {
                  preview.handleError(e);
                  return;
                }
              };
            }
            options.name = "VueLiveCompiledExample";
          };
          calcOptions();

          // In case the template is inlined in the script,
          // we need to compile it
          if (options.template) {
            renderedComponent.template = options.template;
            compileTemplateForEval(renderedComponent);
            calcOptions();
            delete options.template;
          }

          if (this.dataScope) {
            const mergeData = { ...options.data(), ...this.dataScope };
            options.data = () => mergeData;
          }
        }
        checkTemplate(
          {
            template: renderedComponent.raw.template,
            ...options,
          },
          this.checkVariableAvailability
        );
      } catch (e) {
        this.handleError(e);
        return;
      }

      if (this.components) {
        if (!options.components) {
          options.components = this.components;
        } else {
          options.components = { ...options.components, ...this.components };
        }
      }

      this.removeStyle();

      if (style) {
        // To add the scope id attribute to each item in the html
        // this way when we add the scoped style sheet it will be applied
        options.__scopeId = `data-${this.scope}`;
        this.removeScopedStyle = addScopedStyle(style, this.scope);
      }
      if (!options.render) {
        this.handleError({
          message:
            "[Vue Live] no template or render function specified. Example cannot be rendered.",
        });
        return;
      }

      this.previewedComponent = markRaw(options);
      this.iteration = this.iteration + 1;
      this.error = false;
      this.$emit("success");
    },
  },
});
</script>

<style>
.VueLive-error {
  color: red;
  text-align: left;
  overflow: auto;
  white-space: pre-wrap;
}
</style>
