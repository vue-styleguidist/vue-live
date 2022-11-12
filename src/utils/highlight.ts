import { highlight as prismHighlight, languages } from "prismjs";

import "prismjs/components/prism-clike";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-css";
import getScript from "./getScript";
import { parseComponent } from "vue-inbrowser-compiler";

export default async function () {
  return function (lang: "vsg" | "vue", jsxInExamples: boolean) {
    if (lang === "vsg") {
      return (code: string, errorLoc: any) => {
        if (!code) {
          return "";
        }
        const scriptCode = getScript(code, jsxInExamples);
        const scriptCodeHighlighted = prismHighlight(
          scriptCode,
          languages[jsxInExamples ? "jsx" : "js"],
          lang
        );
        if (code.length === scriptCode.length) {
          return getSquiggles(errorLoc) + scriptCodeHighlighted;
        }
        const templateCode = code.slice(scriptCode.length);
        const templateHighlighted = prismHighlight(
          templateCode,
          languages["html"],
          lang
        );

        return (
          getSquiggles(
            errorLoc,
            errorLoc && errorLoc.start ? scriptCode.split("\n").length - 1 : 0
          ) +
          scriptCodeHighlighted +
          templateHighlighted
        );
      };
    } else {
      const langScheme = languages.html;

      return (code: string) => {
        const comp = parseComponent(code);

        const newCode = comp.script
          ? code.slice(0, comp.script.loc.start.offset) + " " + code.slice(comp.script.loc.end.offset)
          : code;

        const htmlHighlighted = prismHighlight(newCode, langScheme, "html");

        return comp.script
          ? htmlHighlighted.replace(
              /<span class="token language-javascript"> <\/span>/g,
              `<span class="token language-typescript">${prismHighlight(
                comp.script.content,
                languages[comp.script.lang || "ts"],
                comp.script.lang || "ts"
              )}</span>`
            )
          : htmlHighlighted;
      };
    }
  };
}

function getSquiggles(errorLoc: any, lineOffset = 0) {
  if (!errorLoc) return "";
  const columnOffSet = errorLoc.start ? 0 : 1;
  const errorWidth = errorLoc.end
    ? errorLoc.end.column - errorLoc.start.column + 1
    : 2;
  let { line, column } = errorLoc.start ? errorLoc.start : errorLoc;
  return (
    '<span class="VueLive-squiggles-wrapper">' +
    Array(line + lineOffset).join("\n") +
    Array(column + columnOffSet).join(" ") +
    '<span class="VueLive-squiggles">' +
    Array(errorWidth).join(" ") +
    "</span></span>"
  );
}
