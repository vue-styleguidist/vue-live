<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <button>Push me</button>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "Welcome to Preview"
    };
  }
};
</script>

<style scoped>
.hello {
  margin: auto;
  text-align: center;
  width: 200px;
  font-size: 2em;
}
</style>
