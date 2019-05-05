import transformOneImport from "../transformOneImport";
import walkes from "walkes";
import getAst from "../getAst";

describe("transformOneImport", () => {
  function getFirstImportNode(code) {
    const ast = getAst(code);
    let firstNode = undefined;
    walkes(ast, {
      ImportDeclaration(node) {
        firstNode = node;
      }
    });
    return firstNode;
  }

  it("should transform default import into require", () => {
    const code = `import foo from 'baz';`;
    const node = getFirstImportNode(code);
    const transformed = transformOneImport(node, code, 0);
    expect(transformed.code).toBe("const foo = require('baz');");
  });

  it("should transform named import into require", () => {
    const code = `import { foo } from 'baz';`;
    const node = getFirstImportNode(code);
    const transformed = transformOneImport(node, code, 0);
    expect(transformed.code).toBe("const { foo } = require('baz');");
  });

  it("should transform re-named import into require", () => {
    const code = `import { bar as foo } from 'baz';`;
    const node = getFirstImportNode(code);
    const transformed = transformOneImport(node, code, 0);
    expect(transformed.code).toBe("const { bar:foo } = require('baz');");
  });

  it("should transform mixed imports into require", () => {
    const code = `import hola, { bar as foo } from 'baz';`;
    const node = getFirstImportNode(code);
    const transformed = transformOneImport(node, code, 0);
    expect(transformed.code).toBe(
      ["const hola = require('baz');", "const { bar:foo } = hola;"].join("\n")
    );
  });
});
