import { scoper } from "./styleScoper";

export default function addScopedStyle(css, suffix) {
  const head = document.head || document.getElementsByTagName("head")[0];
  const newstyle = document.createElement("style");
  newstyle.dataset.cssscoper = "true";
  const csses = scoper(css, `[data-${suffix}]`);
  if (newstyle.styleSheet) {
    newstyle.styleSheet.cssText = csses;
  } else {
    newstyle.appendChild(document.createTextNode(csses));
  }
  head.appendChild(newstyle);
}
