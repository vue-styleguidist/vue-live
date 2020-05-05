import { compile } from "vue-template-compiler";
import { parse } from "acorn";
import * as recast from "recast";

export default function(src, $options) {
  const { ast } = compile(src);
  traverse(ast, (templateAst) => {
    if (templateAst.type !== 1) {
      return;
    }
    templateAst.attrsList
      // for all attribute that has an expression
      .filter((attr) => /^[:,@,v-]/.test(attr.name))
      .forEach((attr) => {
        try {
          // try and parse the expression
          const ast = parse(`() => {${attr.value}}`);
          // identify all variables that would be undefined because not in the data object
          recast.visit(ast, {
            visitIdentifier(identifier) {
              const varName = identifier.value.name;
              if (
                (identifier.name === "expression" ||
                  identifier.name === "argument" ||
                  identifier.parentPath.name === "arguments") &&
                (!$options ||
                  typeof $options.data !== "function" ||
                  !$options.data()[varName])
              ) {
                throw new VueLiveUndefinedVariableError(
                  `Variable "${varName}" is not defined.`,
                  varName
                );
              }
              this.traverse(identifier);
            },
          });
        } catch (e) {
          throw new VueLiveParseTemplateError(e.message, attr.value, e);
        }
      });
  });
}

export function traverse(templateAst, handler) {
  const traverseAstChildren = (templateAst) => {
    const children = templateAst.children;
    if (children) {
      for (const childNode of children) {
        traverse(childNode, handler);
      }
    }

    const scopedSlots = templateAst.scopedSlots;
    if (scopedSlots) {
      Object.keys(scopedSlots).forEach((key) => {
        const slotNode = scopedSlots[key];
        traverse(slotNode, handler);
      });
    }
  };

  handler(templateAst);

  if (templateAst.type === 1) {
    if (templateAst.if && templateAst.ifConditions) {
      // for if statement iterate through the branches
      templateAst.ifConditions.forEach(({ block }) => {
        traverseAstChildren(block);
      });
    } else {
      traverseAstChildren(templateAst);
    }
  }
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
