import { isCodeVueSfc } from "vue-inbrowser-compiler";

export default function(code, jsxInExamples) {
  // In case we are loading a vue component as an example, extract script tag
  if (isCodeVueSfc(code)) {
    if (window.DOMParser) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(code, "text/xml");
      const parts = xmlDoc.getElementsByTagName("script");
      return parts && parts.length ? parts[0].childNodes[0].nodeValue : "";
    }
  }

  // if in JSX mode or literal return examples code as is
  if (jsxInExamples || /new Vue\(/.test(code)) {
    return code;
  }

  if (
    /\n\W+?export\W+default\W/.test(code) ||
    /\n\W+?module.exports(\W+)?=/.test(code)
  ) {
    return code;
  }

  code = code || "";

  //else it will be considered pseudo jsx of vue-styleguidist
  return /^</.test(code.trim()) ? "" : code.split(/\n[\t ]*</)[0];
}
