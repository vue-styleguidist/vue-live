
<script lang="ts" setup>
import { ref } from 'vue'

const msg = ref("Push Me")
</script>

<template>
  <div class="hello">
    <h1>Colored Text</h1>
    <button>{{ msg }}</button>
  </div>
</template>

<style>
.hello {
  text-align: center;
  color: #900;
}
</style>
