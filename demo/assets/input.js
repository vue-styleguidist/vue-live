new Vue({
  template: '<input type="checkbox" :name="cname">',
  data() {
    return {
      cname: "myCheck"
    };
  }
});
