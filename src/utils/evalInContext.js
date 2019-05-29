/**
 * evaluate es5 code in the browser
 * and return value if there s a return statement
 * @param {String} code the body of the funtion to execute
 * @param {Function} require the fake function require
 */
export default function evalInContext(code, require) {
  // eslint-disable-next-line no-new-func
  const func = new Function("require", code);

  return func(require);
}
