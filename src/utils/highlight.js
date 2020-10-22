import {
  highlight as prismHighlight,
  languages,
} from "prismjs/components/prism-core";

import "prismjs/components/prism-clike";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import getScript from "./getScript";

export default (lang, jsxInExamples) => {
  if (lang === "vsg") {
    return (code, errorLoc) => {
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
        return scriptCodeHighlighted;
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
          errorLoc && errorLoc.start ? scriptCode.split("\n").length : 0
        ) +
        scriptCodeHighlighted +
        templateHighlighted
      );
    };
  } else {
    return (code, errorLoc) => {
      const langScheme = languages[lang];
      if (!langScheme) {
        return code;
      }

      let lineOffset = 0;
      // if we look at a SFC code
      if (lang === "html" && errorLoc && errorLoc.start) {
        // offset the line to the block where the error has been discovered
        // in the template if errorLoc has a start & end
        const codeBeforeTemplate = code.split(/<template/)[0];

        lineOffset = codeBeforeTemplate.split("\n").length;
      }

      return (
        getSquiggles(errorLoc, lineOffset) +
        prismHighlight(code, langScheme, lang)
      );
    };
  }
};

function getSquiggles(errorLoc, lineOffset = 0, columnOffSet = 0) {
  if (!errorLoc) return "";
  const errorWidth = errorLoc.end
    ? errorLoc.end.column - errorLoc.start.column + 1
    : 2;
  let line, column;
  if (errorLoc.start) {
    line = errorLoc.start.line - 1;
    column = errorLoc.start.column;
  } else {
    line = errorLoc.line;
    column = errorLoc.column;
  }
  return (
    '<span class="VueLive-squiggles-wrapper"> ' +
    Array(line + lineOffset).join("\n") +
    Array(column + columnOffSet).join(" ") +
    '<span class="VueLive-squiggles">' +
    Array(errorWidth).join(" ") +
    "</span></span>"
  );
}
