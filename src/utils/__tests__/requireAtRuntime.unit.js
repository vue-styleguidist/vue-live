import requireAtRuntime from "../requireAtRuntime";

const map = {
  a: () => "a"
};

test("return a module from the map", () => {
  const result = requireAtRuntime(map, "a");
  expect(result).toBeDefined();
  expect(result()).toBe("a");
});

test("throw if module is not in the map", () => {
  const fn = () => requireAtRuntime(map, "pizza");
  expect(fn).toThrowError("require() statements can be added");
});
