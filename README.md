# vue-live

A lightweight playground for live editing VueJs code in the browser

[![Build Status](https://travis-ci.com/vue-styleguidist/vue-live.svg?branch=master)](https://travis-ci.com/vue-styleguidist/vue-live)
[![NPM Version](https://img.shields.io/npm/v/vue-live.svg)](https://www.npmjs.com/package/vue-live) [![NPM Downloads](https://img.shields.io/npm/dm/vue-live.svg)](https://www.npmjs.com/package/vue-live)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

---

## Usage

The simplest way to render components is as a VueJs template:

```vue
<template>
    <VueLive :code="`<date-picker />`" :components="{ DatePicker }" @error="(e) => handleError(e)">
</template>

<script>
import { VueLive } from "vue-live";
import DatePicker from "vuejs-datepicker"

export default {
    components: { VueLive },
    data(){
        return {
            // make DatePicker available in template
            DatePicker
        }
    }
}
</script>
```

Check out the [demo](http://vue-live.surge.sh) for alternative syntaxes to write your showcases.

## Enabling template compilation

To compile templates in the browser, you need the compiler to be in your JS bundle.

If you do not, you might see errors about using the runtime version of Vue.

To bundle this, there is a simple solution: Add an alias in `webpack.config.js`.

```js
module.export = {
  resolve: {
    alias: {
      // this enables loading the "full" version of vue
      // instead of only loading the vue runtime
      vue$: "vue/dist/vue.esm.js",
    },
  },
};
```

in [nuxt.config.js](https://nuxtjs.org/faq/extend-webpack/)

```js
export default {
  build: {
    extend(config, { isDev, isClient }) {
      // ..
      config.resolve.alias.vue$ = "vue/dist/vue.esm.js";
    },
  },
};
```

and finally in [gridsome.config.js](https://gridsome.org/docs/config/#configurewebpack)

```js
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        vue$: "vue/dist/vue.esm.js",
      },
    },
  },
};
```

## How to contribute

```sh
npm ci
```

### Compiles and hot-reloads for development

```sh
npm run start
```

### Compiles and minifies library for production using rollup

```sh
npm run build
```

### Run unit and e2e tests

```sh
npm run test:unit
npm run test:e2e
```

### Lints and fixes files

```sh
npm run lint
```
