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
        getSquiggles(errorLoc, scriptCode.split("\n").length) +
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

      return getSquiggles(errorLoc) + prismHighlight(code, langScheme, lang);
    };
  }
};

function getSquiggles(errorLoc, lineOffset = 0) {
  const errorWidth =
    errorLoc && errorLoc.end
      ? errorLoc.end.column - errorLoc.start.column + 1
      : 2;
  let { line, column } = errorLoc ? errorLoc.start || errorLoc : {};
  return errorLoc
    ? '<span class="VueLive-squiggles-wrapper"> ' +
        Array(errorLoc.start ? line + lineOffset - 1 : line).join("\n") +
        Array(column).join(" ") +
        '<span class="VueLive-squiggles">' +
        Array(errorWidth).join(" ") +
        "</span></span>"
    : "";
}
