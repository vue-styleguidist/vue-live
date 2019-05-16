var acorn = require("acorn");
var jsx = require("acorn-jsx");

export default function getAst(code) {
  return acorn.Parser.extend(jsx()).parse(code, {
    ecmaVersion: 2019,
    sourceType: "module"
  });
}
