import checkTemplate from "../checkTemplate";

test("parse valid template without error with a function", () => {
  expect(() =>
    checkTemplate('<div><a :href="foo()">hello</a></div>')
  ).not.toThrow();
});

test("parse valid template without error with a value", () => {
  expect(() =>
    checkTemplate('<div><compo :value="today">hello</compo></div>', {
      data() {
        return {
          today: "hello"
        };
      }
    })
  ).not.toThrow();
});

test("parse invalid template with an error in the ++", () => {
  expect(() =>
    checkTemplate('<div><compo :value="today++">hello</compo></div>')
  ).toThrow();
});

test("parse invalid template with an error in a function call", () => {
  expect(() =>
    checkTemplate('<div><compo :value="callit(today)">hello</compo></div>')
  ).toThrow();
});

test("parse invalid template with an error in a function call and a spread", () => {
  expect(() =>
    checkTemplate('<div><compo :value="callit(...today)">hello</compo></div>')
  ).toThrow();
});

test("parse invalid template with an error if the value is not in data", () => {
  expect(() =>
    checkTemplate('<div><compo :value="today">hello</compo></div>')
  ).toThrowErrorMatchingInlineSnapshot(
    `"Variable \\"today\\" is not defined."`
  );
});

test("parse invalid : template by throwing an error", () => {
  expect(() =>
    checkTemplate('<div><a :href="+++foo()">hello</a></div>')
  ).toThrowErrorMatchingInlineSnapshot(`"Assigning to rvalue (1:9)"`);
});

test("parse invalid @ template by throwing an error", () => {
  expect(() =>
    checkTemplate('<div><a @click="+++foo()">hello</a></div>')
  ).toThrowErrorMatchingInlineSnapshot(`"Assigning to rvalue (1:9)"`);
});
