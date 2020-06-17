import { parse as parseVue } from "@vue/compiler-dom";
import { createCompilerError } from "@vue/compiler-core/dist/compiler-core.cjs";
import { parse as parseEs } from "acorn";
import { visit } from "recast";
import has from "lodash.has";

const ELEMENT = 1;
const SIMPLE_EXPRESSION = 4;
const INTERPOLATION = 5;

export default function($options) {
  if (!$options.template) {
    return;
  }
  let ast;
  try {
    ast = parseVue($options.template);
  } catch (e) {
    throw createCompilerError(e.code);
  }
  traverse(ast, [
    (templateAst) => {
      if (templateAst.type === ELEMENT) {
        templateAst.props.forEach((attr) => {
          const exp =
            attr.type !== SIMPLE_EXPRESSION && attr.exp
              ? attr.exp.content
              : undefined;
          if (!exp) {
            return;
          }
          try {
            checkExpression(exp, $options);
          } catch (e) {
            throw new VueLiveParseTemplateError(e.message, exp, e);
          }
        });
      } else if (templateAst.type === INTERPOLATION) {
        try {
          if (templateAst.content) {
            checkExpression(templateAst.content.content, $options);
          }
        } catch (e) {
          throw new VueLiveParseTemplateError(
            e.message,
            templateAst.content,
            e
          );
        }
      }
    },
  ]);
}

export function checkExpression(expression, $options) {
  // try and parse the expression
  const ast = parseEs(`(function(){return ${expression}})()`);

  // identify all variables that would be undefined because not in the data object
  visit(ast, {
    visitIdentifier(identifier) {
      const varName = identifier.value.name;
      if (
        identifier.name === "expression" ||
        identifier.name === "argument" ||
        identifier.parentPath.name === "arguments"
      ) {
        if (!$options || typeof $options.data !== "function") {
          throw new VueLiveUndefinedVariableError(
            `Variable "${varName}" is not defined.`,
            varName
          );
        }
        if (
          !has($options.data(), varName) &&
          !has($options.props, varName) &&
          !(
            Array.isArray($options.props) &&
            $options.props.indexOf(varName) !== -1
          )
        ) {
          throw new VueLiveUndefinedVariableError(
            `Variable "${varName}" is not defined.`,
            varName
          );
        }
      }

      this.traverse(identifier);
    },
  });
}

export function traverse(templateAst, handlers) {
  const traverseAstChildren = (templateAst) => {
    const { children } = templateAst;
    if (children) {
      for (const childNode of children) {
        traverse(childNode, handlers);
      }
    }
  };

  handlers.forEach((handler) => {
    handler(templateAst);
  });

  traverseAstChildren(templateAst);
}

export function VueLiveUndefinedVariableError(message, varName) {
  this.message = message;
  this.varName = varName;
}

export function VueLiveParseTemplateError(message, expression, subError) {
  this.message = message;
  this.expression = expression;
  this.subError = subError;
}
