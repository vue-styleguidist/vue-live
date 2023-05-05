import { resolve } from "path";
import { defineConfig } from "vite";
import pkg from "./package.json";
import baseConfig from "./vite.config";

// https://vitejs.dev/config/
export default Object.assign(
  baseConfig,
  defineConfig({
    build: {
      outDir: "lib",
      lib: {
        // Could also be a dictionary or array of multiple entry points
        entry: resolve(__dirname, "src/index.ts"),
        name: "VueLive",
        // the proper extensions will be added
        fileName: "vue-live",
      },
      rollupOptions: {
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        external: [
          ...Object.keys(pkg.dependencies),
          // make sure jsx schema is loaded from external
          "prismjs/components/prism-clike.js",
          "prismjs/components/prism-markup.js",
          "prismjs/components/prism-javascript.js",
          "prismjs/components/prism-typescript.js",
          "prismjs/components/prism-jsx.js",
          "prismjs/components/prism-css.js",
          "@vue/compiler-core/dist/compiler-core.cjs",
          "@vue/compiler-dom/dist/compiler-dom.cjs",
          "@vue/compiler-dom",
          "vue",
        ],
        output: {
          // Provide global variables to use in the UMD build
          // for externalized deps
          globals: {
            vue: "Vue",
            prismjs: "PrismJs",
            acorn: "Acorn",
            "hash-sum": "Hash",
            "vue-inbrowser-compiler-sucrase": "VueInBrowserCompilerSucrase",
            "vue-inbrowser-prismjs-highlighter": "VueInBrowserPrismjsHighlighter",
						"@vue/compiler-core": "VueCompilerCore",
						"@vue/compiler-dom": "VueCompilerDom",
						"acorn-walk": "AcornWalk",
						"vue-prism-editor": "VuePrismEditor",
						"debounce": "Debounce",
          },
          exports: "named",
        },
      },
    },
  })
);
