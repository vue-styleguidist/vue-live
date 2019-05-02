new Vue({
  template: `
<div>
  <input v-model="value" type="checkbox" :name="cname">
  <h1 v-if="value">I am checked</h1>
</div>`,
  data() {
    return {
      cname: "myCheck",
      value: false
    };
  }
});
