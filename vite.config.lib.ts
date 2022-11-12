import { resolve } from "path";
import pkg from "./package.json";
import baseConfig from "./vite.config";

// https://vitejs.dev/config/
export default Object.assign(baseConfig, {
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/index.ts"),
      name: "VueLive",
      // the proper extensions will be added
      fileName: "lib/vue-live",
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        ...Object.keys(pkg.dependencies),
        // make sure jsx schema is loaded from external
        "@babel/runtime/helpers/slicedToArray",
        "@babel/runtime/helpers/defineProperty",
        "@babel/runtime/helpers/toConsumableArray",
        "prismjs/components/prism-core",
        "prismjs/components/prism-clike",
        "prismjs/components/prism-markup",
        "prismjs/components/prism-javascript",
        "prismjs/components/prism-jsx",
        "@vue/compiler-core/dist/compiler-core.cjs",
        "vue",
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
