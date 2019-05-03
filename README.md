
# vue-live

A lightweight playground for live editing VueJs code in the browser

[![Build Status](https://travis-ci.com/vue-styleguidist/vue-live.svg?branch=master)](https://travis-ci.com/vue-styleguidist/vue-live)
[![NPM Version](https://img.shields.io/npm/v/vue-live.svg)](https://www.npmjs.com/package/vue-live) [![NPM Downloads](https://img.shields.io/npm/dm/vue-live.svg)](https://www.npmjs.com/package/vue-live)

----

## Usage

The simplest way to render components is as a VueJs template:

``` vue
<template>
    <VueLive :code="`<date-picker />`" :components="{ DatePicker }">
</template>

<script>
import VueLive from "vue-live";
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

Check out the [demo](http://vue-live.surge.sh) for alernative syntaxes to write your showcases.

## How to contribute
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Run your tests
```
yarn test:unit
```

### Lints and fixes files
```
yarn lint
```
