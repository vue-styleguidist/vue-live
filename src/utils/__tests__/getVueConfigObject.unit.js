import getVueConfigObject from "../getVueConfigObject";

describe("getVueConfigObject", () => {
  it("should extract parameters", () => {
    const data = getVueConfigObject("new Vue({param:'baz'})", []);
    expect(data.param).toBe("baz");
  });

  it("should assign variables to data", () => {
    const data = getVueConfigObject("var foo = 'baz'; new Vue({})", ["foo"]);
    expect(data.data().foo).toBe("baz");
  });
});
