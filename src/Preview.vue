<template>
  <pre v-if="debug">{{ compiledCodeForDebug }}</pre>
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
    debug: {
      type: Boolean,
      default: false
    },
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
     * Hashtable of auto-registered directives
     * @example { Tooltip: VueTooltip }
     * @example { VueTooltip }
     */
    directives: {
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
      previewedComponent: markRaw(defineComponent({
        render: () => h("div"),
      })),
      iteration: 0,
      error: false as string | false,
      removeScopedStyle: () => { },
      compiledCodeForDebug: "",
    };
  },
  computed: {
    requiresPlusVue(): Record<string, any> {
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
    handleError(e: any, type: string) {
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
      this.error = `${type} Error - ${e.message}`;
    },
    removeStyle() {
      if (this.removeScopedStyle) {
        this.removeScopedStyle();
      }
    },
    async renderComponent(code: string) {
      let style;
      const scopeAttribute = `data-${this.scope}`
      const tryCompile = () => {
        try {
          return compileScript(
            code,
            this.jsx
              ? {
                jsxPragma: "__pragma__(h)",
              } : {},
            scopeAttribute
          );
        } catch (e) {
          this.handleError(e, "Compilation");
          return undefined
        }
      }

      const renderedComponent = tryCompile();
      if (!renderedComponent) { return; }

      if (this.debug) {
        this.compiledCodeForDebug = Object.entries(renderedComponent).map(([key, code]) => typeof code === 'string' ? `<${key}>\n${code}\n</${key}>` : '').join("\n\n")
      }
      style = renderedComponent.style;

      // if the compiled code contains a script it might be "just" a script
      // if so, change scheme used by editor
      // NOTE: vsg is a superset of JavaScript allowing
      // the template to add javascript code above the template without fluff, very useful for examples
      // NOTE2: vsg stands for vue-styleguidist
      this.$emit("detect-language", isCodeVueSfc(code) ? "vue" : "vsg");

      // compile and execute the script
      // it can be:
      // - a script setting up variables => we set up the data property of renderedComponent
      // - a `new Vue()` script that will return a full config object
      const calcOptions = async () => {
        if (renderedComponent.script) {
          try {
            const script = renderedComponent.script;
            const requires: typeof this.requires = {}
            await Promise.allSettled(Object.keys(this.requiresPlusVue).map(async (key) => {
              requires[key] = this.requiresPlusVue[key] instanceof Promise ? (await this.requiresPlusVue[key]).default : this.requiresPlusVue[key]
            }))
            const tryOptions = defineComponent((evalInContext(
              script,
              (filepath) => requireAtRuntime(requires, filepath),
              adaptCreateElement,
              concatenate,
              h
            ) || {}));
            tryOptions.name = "VueLiveCompiledExample";
            return tryOptions
          } catch (e) {
            this.handleError(e, "Evaluation");
            return undefined
          }
        } else {
          return defineComponent({})
        }
      }
      const options = await calcOptions();

      if (!options) { return; }

      // In case the template is inlined in the script,
      // we need to compile it
      if (typeof options.template === "string") {
        try {
          renderedComponent.template = options.template;
          compileTemplateForEval(renderedComponent);
          await calcOptions();
          checkTemplate({
            ...(options as any),
            template: options.template,
          },
            this.checkVariableAvailability);
          delete options.template;
        } catch (e) {
          this.handleError(e, "Template");
          return;
        }
      }

      if (this.dataScope) {
        const mergeData = { ...(options as any)?.data(), ...this.dataScope };
        options.data = () => mergeData;
      }

      const template = renderedComponent.raw.template
      if (template) {
        try {
          checkTemplate({
            ...(options as any),
            template,
          },
            this.checkVariableAvailability
          );
        } catch (e) {
          this.handleError(e, "Template");
          return;
        }
      }


      if (this.components) {
        if (!options.components) {
          options.components = this.components;
        } else {
          options.components = { ...options.components, ...this.components };
        }
      }

      if (this.directives) {
        if (!options.directives) {
          options.directives = this.directives;
        } else {
          options.directives = { ...options.directives, ...this.directives };
        }
      }

      this.removeStyle();

      if (style) {
        // To add the scope id attribute to each item in the html
        // this way when we add the scoped style sheet it will be applied
        options.__scopeId = scopeAttribute;
        this.removeScopedStyle = addScopedStyle(style, this.scope);
      }

      if (!options.render) {
        this.handleError({
          message:
            "[Vue Live] no template or render function specified. Example cannot be rendered.",
        }, "Render");
        return;
      }

      options.errorCaptured = (e: any) => {
        this.handleError(e, "Runtime");
        return false;
      };

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
