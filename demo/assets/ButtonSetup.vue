<script lang="ts" setup>
import { ref, h } from 'vue'

const MyButton = () => {
	return h('button', 
		{
			style: { color: 'red' },
			"data-cy": "my-button"
		},
		'inline component'
	)
}

const msg = ref("Push Me")
</script>

<template>
  <div class="hello">
    <h1>Colored Text</h1>
    <input v-model="msg">
		<div>
			{{ msg }}
		</div>
		<div>
			<MyButton/>
		</div>
  </div>
</template>