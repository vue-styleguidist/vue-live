new Vue({
  template: `
<div>
  <input v-model="value" type="checkbox">
  <h1 v-if="value">I am checked</h1>
</div>`,
  data() {
    return {
      value: false,
    };
  },
});
