<script lang="ts" setup>
import { ref, h } from 'vue'

const MyButton = () => {
	return h('button', 
		{
			style: {
				color: 'red'
			}
		},
		'Push Me'
	)
}

const msg = ref("Push Me")
</script>

<template>
  <div class="hello">
    <h1>Colored Text</h1>
    <button>{{ msg }}</button>
		<MyButton/>
  </div>
</template>

<style>
.hello {
  text-align: center;
  color: #900;
}
</style>
