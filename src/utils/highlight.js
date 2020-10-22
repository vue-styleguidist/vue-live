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
    return (code, errorLoc) => {
      const langScheme = languages[lang];
      if (!langScheme) {
        return code;
      }

      return (
        // if the error is in the template no need for column padding
        getSquiggles(errorLoc) + prismHighlight(code, langScheme, lang)
      );
    };
  }
};

function getSquiggles(errorLoc, lineOffset = 0, columnOffSet = 0) {
  if (!errorLoc) return "";
  columnOffSet = errorLoc.start ? 0 : 1;
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
