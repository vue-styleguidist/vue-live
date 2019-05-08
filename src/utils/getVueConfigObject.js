import evalInContext from "./evalInContext";
import requireAtRuntime from "./requireAtRuntime";

export default function getVueConfigObject(compiledCode, listVars, requires) {
  const exampleComponentCode = `let __component__ = {};${
    // run script for SFC and full scripts
    // and set config object in __component__
    // if the structure is vsg mode, define local variables
    // to set them up in the next step
    compiledCode
  };__component__.data = __component__.data || function() {return {${
    // add local vars in data
    // this is done through an object like {varName: varName}
    // since each varName is defined in compiledCode, it can be used to init
    // the data object here
    listVars.map(varName => `${varName}: ${varName}`).join(",")
  }}};${
    // When we do new Vue({name: 'MyComponent'}) the comfig object
    // is set to __component__
    `function Vue(params){ __component__ = params; }
    return __component__;`
  }`;
  return evalInContext(exampleComponentCode, filepath =>
    requireAtRuntime(requires, filepath)
  );
}
