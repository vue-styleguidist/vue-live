import checkTemplate from "../checkTemplate";

test("parse valid template without error with a function", () => {
  expect(() =>
    checkTemplate({ template: '<div><a :href="foo()">hello</a></div>' })
  ).not.toThrow();
});

test("parse valid template without error with a value", () => {
  expect(() =>
    checkTemplate({
      template: '<div><compo :value="today">hello</compo></div>',
      data() {
        return {
          today: "hello"
        };
      }
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
          value: false
        };
      }
    })
  ).not.toThrow();
});

test("parse invalid template with an error in the ++", () => {
  expect(() =>
    checkTemplate({
      template: '<div><compo :value="today++">hello</compo></div>'
    })
  ).toThrow();
});

test("parse invalid template with an error in a function call", () => {
  expect(() =>
    checkTemplate({
      template: '<div><compo :value="callit(today)">hello</compo></div>'
    })
  ).toThrow();
});

test("parse invalid template with an error in a function call and a spread", () => {
  expect(() =>
    checkTemplate({
      template: '<div><compo :value="callit(...today)">hello</compo></div>'
    })
  ).toThrow();
});

test("parse invalid template with an error if the value is not in data", () => {
  expect(() =>
    checkTemplate({
      template: '<div><compo :value="today">hello</compo></div>'
    })
  ).toThrowErrorMatchingInlineSnapshot(
    `"Variable \\"today\\" is not defined."`
  );
});

test("parse template interpolatio and detect undefined variables", () => {
  expect(() =>
    checkTemplate({
      template: "<div><compo>{{ hello }}</compo></div>"
    })
  ).toThrowErrorMatchingInlineSnapshot(
    `"Variable \\"hello\\" is not defined."`
  );
});

test("parse invalid : template by throwing an error", () => {
  expect(() =>
    checkTemplate({
      template: '<div><a :href="+++foo()">hello</a></div>'
    })
  ).toThrowErrorMatchingInlineSnapshot(`"Assigning to rvalue (1:9)"`);
});

test("parse invalid @ template by throwing an error", () => {
  expect(() =>
    checkTemplate({
      template: '<div><a @click="+++foo()">hello</a></div>'
    })
  ).toThrowErrorMatchingInlineSnapshot(`"Assigning to rvalue (1:9)"`);
});
