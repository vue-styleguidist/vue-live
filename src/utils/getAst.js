import { Parser } from "acorn";
const jsx = require("acorn-jsx");

export default function getAst(code) {
  return Parser.extend(jsx()).parse(code, {
    ecmaVersion: 2019,
    sourceType: "module"
  });
}
