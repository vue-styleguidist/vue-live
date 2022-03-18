/**
 * evaluate es5 code in the browser
 * and return value if there s a return statement
 * @param {String} code the body of the function to execute
 * @param {Function} require the fake function require
 */
export default function evalInContext(
  code,
  require,
  adaptCreateElement,
  concatenate,
  h
) {
  // eslint-disable-next-line no-new-func
  const func = new Function(
    "require",
    "__pragma__",
    "__concatenate__",
    "h",
    code
  );

  return func(require, adaptCreateElement, concatenate, h);
}
