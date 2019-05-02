<template>
  <div class="hello">
    <button>{{ msg }}</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "Push Me"
    };
  }
};
</script>

<style scoped>
.hello {
  text-align: center;
}
</style>
