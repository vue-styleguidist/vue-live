export default function evalInContext(code, require) {
  // eslint-disable-next-line no-new-func
  const func = new Function("require", code);

  return func(require);
}
