import checkTemplateDummy from "../checkTemplate";

const checkTemplate = (opts) => checkTemplateDummy(opts, true);

test("parse valid template without error with a function", () => {
  expect(() =>
    checkTemplate({ template: '<div><a :href="foo()">hello</a></div>' })
  ).not.toThrow();
});

test("parse valid template without error with a value in data", () => {
  expect(() =>
    checkTemplate({
      template: '<div><compo :value="today">hello</compo></div>',
      data() {
        return {
          today: "hello",
        };
      },
    })
  ).not.toThrow();
});

test("parse valid template without error with a value in props", () => {
  expect(() =>
    checkTemplate({
      template: '<div><compo :value="today">hello</compo></div>',
      props: {
        today: { type: String },
      },
    })
  ).not.toThrow();
});

test("parse valid template without error with a value in computed", () => {
  expect(() =>
    checkTemplate({
      template: '<div><compo :value="today">hello</compo></div>',
      computed: {
        today() {
          return "bonjour";
        },
      },
    })
  ).not.toThrow();
});

test("parse valid template without error with a value in methods", () => {
  expect(() =>
    checkTemplate({
      template: '<div><compo :value="today">hello</compo></div>',
      methods: {
        today() {
          return "bonjour";
        },
      },
    })
  ).not.toThrow();
});

test("parse false value as a valid value", () => {
  expect(() =>
    checkTemplate({
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
    })
  ).not.toThrow();
});

test("parse invalid template with an error in the ++", () => {
  expect(() =>
    checkTemplate({
      template: '<div><compo :value="today++">hello</compo></div>',
    })
  ).toThrow();
});

test("parse invalid template with an error in a function call", () => {
  expect(() =>
    checkTemplate({
      template: '<div><compo :value="callit(today)">hello</compo></div>',
    })
  ).toThrow();
});

test("parse invalid template with an error in a function call and a spread", () => {
  expect(() =>
    checkTemplate({
      template: '<div><compo :value="callit(...today)">hello</compo></div>',
    })
  ).toThrow();
});

test("if it starts with dollar, it should not throw", () => {
  expect(() =>
    checkTemplate({
      template: '<div><compo :value="$today++">hello</compo></div>',
    })
  ).not.toThrow();
});

test("parse a valid arrow event handler properly", () => {
  expect(() =>
    checkTemplate({
      template:
        '<div><compo @click="( evt ) => { test(evt); }">hello</compo></div>',
      methods: {
        test(e) {
          console.log(e.target);
        },
      },
    })
  ).not.toThrow();
});

test("parse a valid standard event handler properly", () => {
  expect(() =>
    checkTemplate({
      template:
        '<div><compo @click="function( evt ) { test(evt); }">hello</compo></div>',
      methods: {
        test(e) {
          console.log(e.target);
        },
      },
    })
  ).not.toThrow();
});

test("parse invalid template with an error if the value is not in data", () => {
  expect(() =>
    checkTemplate({
      template: '<div><compo :value="today">hello</compo></div>',
    })
  ).toThrowErrorMatchingInlineSnapshot(
    `"Variable \\"today\\" is not defined."`
  );
});

test("parse template interpolation and detect lonely undefined variables", () => {
  expect(() =>
    checkTemplate({
      template: "<div><compo>{{ hello }}</compo></div>",
    })
  ).toThrowErrorMatchingInlineSnapshot(
    `"Variable \\"hello\\" is not defined."`
  );
});

test("parse template interpolation and detect impacted undefined variables", () => {
  expect(() =>
    checkTemplate({
      template: "<div><compo>{{ hello + 'bonjour' }}</compo></div>",
    })
  ).toThrowErrorMatchingInlineSnapshot(
    `"Variable \\"hello\\" is not defined."`
  );
});

test("parse template interpolation and detect impacted right variables", () => {
  expect(() =>
    checkTemplate({
      template:
        "<div><compo>{{ 'bonjour' + hello + 'sayonara' }}</compo></div>",
    })
  ).toThrowErrorMatchingInlineSnapshot(
    `"Variable \\"hello\\" is not defined."`
  );
});

test("parse invalid : template by throwing an error", () => {
  expect(() =>
    checkTemplate({
      template: '<div><a :href="+++foo()">hello</a></div>',
    })
  ).toThrowErrorMatchingInlineSnapshot(`"Assigning to rvalue (1:21)"`);
});

test("parse invalid @ template by throwing an error", () => {
  expect(() =>
    checkTemplate({
      template: '<div><a @click="+++foo()">hello</a></div>',
    })
  ).toThrowErrorMatchingInlineSnapshot(`"Assigning to rvalue (1:21)"`);
});

test("parse valid object not to throw", () => {
  expect(() =>
    checkTemplate({
      template: '<div><CustomSelect :options="{foo:1, bar:2}" /></div>',
    })
  ).not.toThrow();
});

test("parse expression using mutiple lines to throw", () => {
  expect(() =>
    checkTemplate({
      template: `<div><CustomSelect @event="
        test();
        callFunction(hello);
      " /></div>`,
    })
  ).toThrowErrorMatchingInlineSnapshot(
    `"Variable \\"hello\\" is not defined."`
  );
});

test("parse v-for expressions and add their vars to available data", () => {
  expect(() =>
    checkTemplate({
      template: `<div v-for="hello in [1,2]"><CustomSelect @event="
        test();
        callFunction(hello);
      " /></div>`,
    })
  ).not.toThrow();
});

test("parse v-for expressions with index and add their vars to available data", () => {
  expect(() =>
    checkTemplate({
      template: `<div v-for="(hello, index) in [1,2]"><CustomSelect @event="
        test(index);
        callFunction(hello);
      " /></div>`,
    })
  ).not.toThrow();
});

test("parse v-slot-scope expressions without issues", () => {
  expect(() =>
    checkTemplate({
      template: `<template v-slot:default="hello"><CustomSelect @event="
        test();
        callFunction(hello);
      " /></template>`,
    })
  ).not.toThrow();
});

test("parse v-slot-scope deconstructed expressions without issues", () => {
  expect(() =>
    checkTemplate({
      template: `<template v-slot:default="{ bye: hello, whats: up, foo }"><CustomSelect @event="
        test();
        callFunction(hello);
      " /></template>`,
    })
  ).not.toThrow();
});

test("parse v-slot-scope deconstructed array expressions without issues", () => {
  expect(() =>
    checkTemplate({
      template: `<template v-slot:default="[ hello ]"><CustomSelect @event="
        test();
        callFunction(hello);
      " /></template>`,
    })
  ).not.toThrow();
});

test("parse v-for nested expressions and add their vars to available data", () => {
  expect(() =>
    checkTemplate({
      template: `<div v-for="hello in [1,2]">
        <div v-for="other in [1,2]">
          <CustomSelect @event="
            test();
            callFunction(hello);
          " />
        </div>
      </div>`,
    })
  ).not.toThrow();
});
