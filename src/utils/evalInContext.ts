/**
 * evaluate es5 code in the browser
 * and return value if there s a return statement
 * @param {String} code the body of the function to execute
 * @param {Function} require the fake function require
 */
export default function evalInContext(
  code: string,
  require: (path: string) => any,
  adaptCreateElement: (h: any) => any,
  concatenate: (...ags: any[]) => any,
  h: (...ags: any[]) => any
): Record<string, any> {
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
