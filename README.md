# vue-live

A lightweight playground for live editing VueJs code in the browser

[![Build Status](https://travis-ci.com/vue-styleguidist/vue-live.svg?branch=master)](https://app.travis-ci.com/github/vue-styleguidist/vue-live)
[![NPM Version](https://img.shields.io/npm/v/vue-live.svg)](https://www.npmjs.com/package/vue-live) [![NPM Downloads](https://img.shields.io/npm/dm/vue-live.svg)](https://www.npmjs.com/package/vue-live)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

---

## Usage

Install the dependency:

```
npm install --save vue-live
```

The simplest way to render components is as a VueJs template:

```vue
<template>
  <VueLive
    :code="`<date-picker />`"
    :components="{ DatePicker }"
    @error="(e) => handleError(e)"
  />
</template>

<script>
import { VueLive } from "vue-live";
// import the css separately for easier SSR
import "vue-live/lib/vue-live.esm.css";
import DatePicker from "vuejs-datepicker";

export default {
  components: { VueLive },
  data() {
    return {
      // make DatePicker available in template
      DatePicker,
    };
  },
};
</script>
```

Check out the [demo](http://vue-live.surge.sh) for alternative syntaxes to write your showcases.

### Install for Vue 2.X

The default version at `@latest` is for vue 3 and up.

To install the version for vue 2, use the following:

```
npm install --save vue-live@1
```

## Enabling template compilation

To compile templates in the browser, you need the compiler to be in your JS bundle.

If you do not, you might see errors about using the runtime version of Vue.

To bundle this, there is a simple solution: Add an alias in `webpack.config.js`.

```js
module.exports = {
  resolve: {
    alias: {
      // this enables loading the "full" version of vue
      // instead of only loading the vue runtime
      vue$: "vue/dist/vue.esm-browser.js",
    },
  },
};
```

In a [Vue CLI](https://cli.vuejs.org/) project use [vue.config.js](https://cli.vuejs.org/guide/webpack.html).

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

in [nuxt.config.js](https://nuxtjs.org/faq/extend-webpack/)

```js
export default {
  build: {
    extend(config, { isDev, isClient }) {
      // ..
      config.resolve.alias.vue$ = "vue/dist/vue.esm-browser.js";
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
        vue$: "vue/dist/vue.esm-browser.js",
      },
    },
  },
};
```

## Events

### `@error`

When the template compilation or the script evaluation fail, errors are returned in this box. Hooking on these errors will not prevent them from displaying on the preview panel but will allow you to provide more info to your users about how to fix what they see.

```vue
<template>
  <VueLive
    code="<h1>make this example {{ fail }}</h1>"
    @error="(e) => log('Error on first example', e)"
  />
</template>
```

### `@success`

When the template compilation and the script evaluation succeed, the `@success` event is emitted. If you provided extra info to your user about previous errors, you can use this event to clear the error message.

```vue
<template>
  <VueLive
    :code="code"
    @success="error = undefined"
  />
</template>
```

## Props

### `code`

**Type** String

Specifies the initial code to be evaluated

```vue
<template>
  <VueLive code="<button>test</button>" />
</template>
```

### `layout`

**Type** vue component

Layout to be used for displaying the

Example

```vue
<template>
  <VueLive :layout="layout" />
</template>
<script>
import layout from "./Layout.vue";

export default {
  data() {
    return { layout };
  },
};
</script>
```

`layout.vue`

```vue
<template>
  <div class="my-vuelive">
    <div class="my-vuelive-editor">
      <slot name="editor"></slot>
    </div>
    <div class="my-vuelive-preview">
      <slot name="preview"></slot>
    </div>
  </div>
</template>
<style>
.my-vuelive {
  border: 1px solid #ccc;
  border-radius: 10px;
}

.my-vuelive-editor {
  margin: 8px;
}

.my-vuelive-preview {
  margin: 8px;
}
</style>
```

### `components`

**Type** Object:

- key: registration name
- value: VueJs component object

Register some components to be used in the vue-live instance.

Example

```vue
<template>
  <VueLive :components="registeredComponents" code="<DatePicker />" />
</template>
<script>
import DatePicker from "./DatePicker.vue";

export default {
  data() {
    return {
      registeredComponents: {
        DatePicker,
      },
    };
  },
};
</script>
```

### `requires`

**Type** Object:

- key: query in the require/import statement
- value: value returned by an es5 reauire statement

To allow require statements on a code evaluated in the browser, we have to pre-package all dependencies. This allows bundlers to know in advance what external dependencies will be allowed in the code.

Example

```vue
<template>
  <VueLive :requires="preRequiredObjects" :code="code" />
</template>
<script>
import DatePicker from "./DatePicker.vue";

export default {
  data() {
    return {
      // lodash can be pre-packaged by the bundler
      // so it can be required at runtime
      preRequiredObjects: {
        lodash: require("lodash"),
      },
      code: `
import _ from 'lodash'

const val = _.each({1,2,3}, (i, v) => {
  return \`\${i} value \${v}\`
})

<li v-for="v in val">
  v : {{v}}
</li>
      `,
    };
  },
};
</script>
```

### `jsx`

**Type** Boolean

JSX does not always play nice with vue templates. If you want to expose vue templates, leave this option off. If you plan on using render functions with JSX, you will have to turn this option on.

Example

```vue
<template>
  <vue-live :code="code" jsx />
</template>
<script>
export default {
  data() {
    return {
      code: `
const args = {
  type: "button",
  value: "update me"
};

export default {
  render() {
    return <input {...args} />;
  }
};      
      `,
    };
  },
};
</script>
```

### `delay`

**Type** Number

Time between a change in the code and its effect in the preview.

> **Note** If a change happens before the prview has changed, the timer is reset.

### `editorProps`

**Type** Object

Props passed directly to [vue-prism-editor](https://github.com/koca/vue-prism-editor) as a spread

### `dataScope`

**Type** Object

Data object that wil be merged with the output data of the preview.

Example

````vue
```vue
<template>
  <VueLive
    :components="registeredComponents"
    :data-scope="dataScope"
    code="<DatePicker :value='today' />{{ today }}"
  />
</template>
<script>
import DatePicker from "./DatePicker.vue";

export default {
  data() {
    return {
      registeredComponents: {
        DatePicker,
      },
      // Without this variable declaration,
      // today will not have a value when entering the
      // particularly useful when examples or only a template
      dataScope: {
        today: new Date(),
      },
    };
  },
};
</script>
````

### `checkVariableAvailability`

**Type** Boolean

Makes sure that every variable in the template actually exists when the user starts editing.

Throws an error in te preview field when the variable dont exist.

### `squiggles`

**Type** Boolean default: `true`

Shows a red indicator when the parser errors with the code given.

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
