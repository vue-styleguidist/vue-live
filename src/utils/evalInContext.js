export default function evalInContext(code) {
  // eslint-disable-next-line no-new-func
  const func = new Function('Vue', code)

  return func()
}
