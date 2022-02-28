import { parse as parseVue } from "@vue/compiler-dom";
// force proper english errors
import { createCompilerError } from "@vue/compiler-core/dist/compiler-core.cjs";
import { parse as parseEs } from "acorn";
import { ancestor, simple } from "acorn-walk";
import defaultAttrAllowList from "./defaultAttrAllowList";

const ELEMENT = 1;
const SIMPLE_EXPRESSION = 4;
const INTERPOLATION = 5;

export default function($options, checkVariableAvailability) {
  if (!$options.template) {
    return;
  }
  let ast;
  try {
    ast = parseVue($options.template);
  } catch (e) {
    throw createCompilerError(e.code, e.loc);
  }

  if (!checkVariableAvailability) {
    return;
  }

  const propNamesArray = $options.props
    ? Array.isArray($options.props)
      ? $options.props
      : Object.keys($options.props)
    : [];

  const dataArray =
    typeof $options.data === "function" ? Object.keys($options.data()) : [];

  const computedArray = $options.computed ? Object.keys($options.computed) : [];

  const methodsArray =
    $options && $options.methods ? Object.keys($options.methods) : [];

  const scriptVars = [
    ...propNamesArray,
    ...dataArray,
    ...computedArray,
    ...methodsArray,
  ];

  // Define list of attributes for which name check will be skipped. Defaults to known camelCased SVG attributes.
  // Allow future enhancement via $options.attrAllowList
  const attrAllowList = $options.attrAllowList || defaultAttrAllowList;

  traverse(ast, [
    (templateAst, parentTemplateVars) => {
      const templateVars = [];
      if (templateAst.type === ELEMENT) {
        templateAst.props.forEach((attr) => {
          if (!attrAllowList.includes(attr.name) && !/^[a-z-:]+$/g.test(attr.name)) {
            throw new VueLiveParseTemplateAttrError(
              "[VueLive] Invalid attribute name: " + attr.name,
              attr.loc
            );
          }
          const exp =
            attr.type !== SIMPLE_EXPRESSION && attr.exp
              ? attr.exp.content
              : undefined;
          if (!exp) {
            return;
          }
          if (attr.name === "slot") {
            const astSlot = parseEs(`var ${exp}=1`, {ecmaVersion:2020});
            simple(astSlot, {
              VariableDeclarator(declarator) {
                // @ts-ignore
                const { id } = declarator;
                switch (id.type) {
                  case "ArrayPattern":
                    id.elements.forEach((e) => {
                      templateVars.push(e.name);
                    });
                    break;
                  case "ObjectPattern":
                    id.properties.forEach((e) => {
                      templateVars.push(e.value.name);
                    });
                    break;
                  case "Identifier":
                    templateVars.push(id.name);
                    break;
                }
                return false;
              },
            });
          } else if (attr.name === "for") {
            const [vForLeft] = exp.split(/( in | of )/);
            const doubleForRE = /\((\w+),(\w+)\)/;
            if (doubleForRE.test(vForLeft.replace(" ", ""))) {
              const vars = doubleForRE.exec(vForLeft.replace(" ", ""));
              templateVars.push(vars[1]);
              templateVars.push(vars[2]);
            } else {
              templateVars.push(vForLeft);
            }
          } else {
            try {
              checkExpression(exp, scriptVars, [
                ...parentTemplateVars,
                ...templateVars,
              ]);
            } catch (e) {
              throw new VueLiveParseTemplateError(e.message, exp, e, attr.loc);
            }
          }
        });
      } else if (templateAst.type === INTERPOLATION) {
        try {
          if (templateAst.content) {
            checkExpression(
              templateAst.content.content,
              scriptVars,
              parentTemplateVars
            );
          }
        } catch (e) {
          throw new VueLiveParseTemplateError(
            e.message,
            templateAst.content,
            e,
            templateAst.loc
          );
        }
      }
      return templateVars;
    },
  ]);
}

export function checkExpression(expression, availableVars, templateVars) {
  // try and parse the expression
  const ast = parseEs(`(function(){return ${expression}})()`, {ecmaVersion:2020});

  // identify all variables that would be undefined because
  // - not in the options object
  // - not defined in the template
  ancestor(ast, {
    Identifier(identifier, ancestors) {
      const varName = identifier.name;
      if (
        // if the identifier is a function call leave it alone
        ancestors.length >= 2 &&
        ancestors[ancestors.length - 2].type === "CallExpression" &&
        ancestors[ancestors.length - 2].callee.name === varName
      ) {
        return;
      } else if (
        availableVars.indexOf(varName) === -1 &&
        templateVars.indexOf(varName) === -1 &&
        !/^\$/.test(varName)
      ) {
        const funcs = ancestors.filter(
          (node) =>
            node.type === "ArrowFunctionExpression" ||
            node.type === "FunctionExpression"
        );
        if (funcs.some((func) => func.params.some((p) => p.name === varName))) {
          return;
        }
        throw new VueLiveUndefinedVariableError(
          `Variable "${varName}" is not defined.`,
          varName
        );
      }
    },
  });
}

export function traverse(templateAst, handlers, availableVarNames = []) {
  const traverseAstChildren = (templateAst, availableVarNamesChildren) => {
    const { children } = templateAst;
    if (children) {
      for (const childNode of children) {
        traverse(childNode, handlers, availableVarNamesChildren);
      }
    }
  };

  // we load this object with all available varnames
  // discovered in the template parsing on v-for and v-slot
  const availableVarNamesThisLevel = handlers.reduce((acc, handler) => {
    const result = handler(templateAst, availableVarNames);
    if (result && result.length) {
      return acc.concat(result);
    }
    return acc;
  }, []);

  traverseAstChildren(templateAst, [
    ...availableVarNames,
    ...availableVarNamesThisLevel,
  ]);
}

export function VueLiveUndefinedVariableError(message, varName) {
  this.message = message;
  this.varName = varName;
}

export function VueLiveParseTemplateAttrError(message, loc) {
  this.message = message;
  this.loc = loc;
}

export function VueLiveParseTemplateError(message, expression, subError, loc) {
  this.message = message;
  this.expression = expression;
  this.subError = subError;
  this.loc = loc;
}
