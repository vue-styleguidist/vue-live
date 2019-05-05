import addScopedStyle from "../addScopedStyle";

describe("addScopedStyle", () => {
  it("should add scoped style to the head", () => {
    addScopedStyle(".foo{ color:red}", "data-baz");
    expect(document.head.getElementsByTagName("style")[0].innerHTML).toContain(
      ".foo[data-data-baz] { color:red}"
    );
  });
});
