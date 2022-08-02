/**
 * Return module from a given map (like {app: require('app')}) or throw.
 */
export default function requireAtRuntime(requires, filepath) {
  requires = requires || {};
  if (!(filepath in requires)) {
    throw new Error(
      "import or require() statements can be added only by setting it using the requires prop"
    );
  }

  return requires[filepath];
}
