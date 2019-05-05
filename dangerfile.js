// eslint-disable-next-line import/no-unresolved, import/extensions
import { danger, warn } from "danger";
import * as fs from "fs";
import * as path from "path";

var validateMessage = require("validate-commit-msg");

const packageChanged = danger.git.modified_files.includes("package.json");
const lockfileChanged = danger.git.modified_files.includes("yarn.lock");

if (packageChanged && !lockfileChanged) {
  warn(`Changes were made to \`package.json\`, but not to \`yarn.lock\`.
If you’ve changed any dependencies (added, removed or updated any packages), please run \`yarn install\` and commit changes in yarn.lock file.`);
}

if (!packageChanged && lockfileChanged) {
  warn(`Changes were made to \`yarn.lock\`, but not to \`package.json\`.
Please remove \`yarn.lock\` changes from your pull request. Try to run \`git checkout master -- yarn.lock\` and commit changes.`);
}

// Check test exclusion (.only) is included
var modifiedSpecFiles = danger.git.modified_files.filter(function(filePath) {
  return filePath.match(/__tests__\/.+\.(js|jsx|ts|tsx)$/gi);
});

var testFilesIncludeExclusion = modifiedSpecFiles.reduce(function(acc, value) {
  var content = fs.readFileSync(value).toString();
  var invalid =
    content.indexOf("it.only") >= 0 || content.indexOf("describe.only") >= 0;
  if (invalid) {
    acc.push(path.basename(value));
  }
  return acc;
}, []);

if (testFilesIncludeExclusion.length > 0) {
  fail("an `only` was left in tests (" + testFilesIncludeExclusion + ")");
}

// Check test cases missing type signature import for test marble helper functions
var testFilesMissingTypes = modifiedSpecFiles.reduce(function(acc, value) {
  var content = fs.readFileSync(value).toString();

  var hotFnMatchesWithoutTypes =
    content.match(hotMatch) && !content.match(hotSignatureMatch);
  var coldFnMatchesWithoutTypes =
    content.match(coldMatch) && !content.match(coldSignatureMatch);

  if (hotFnMatchesWithoutTypes || coldFnMatchesWithoutTypes) {
    acc.push(path.basename(value));
  }

  return acc;
}, []);

if (testFilesMissingTypes.length > 0) {
  fail(
    "missing type definition import in tests (" +
      testFilesMissingTypes +
      ") (" +
      ++errorCount +
      ")"
  );
  markdown(
    "> (" +
      errorCount +
      ") : It seems updated test cases uses test scheduler interface `hot`, `cold` but miss to import type signature for those."
  );
}

//validate commit message in PR if it conforms conventional change log, notify if it doesn't.
var messageConventionValid = danger.git.commits.reduce(function(acc, value) {
  var valid = validateMessage(value.message);
  return valid && acc;
}, true);

if (!messageConventionValid) {
  warn(
    "commit message does not follows conventional change log (" +
      ++errorCount +
      ")"
  );
  markdown(
    "> (" +
      errorCount +
      ") : vue-styleguidist uses conventional change log to generate changelog automatically. It seems some of commit messages are not following those, please check [contributing guideline](https://github.com/ReactiveX/rxjs/blob/master/CONTRIBUTING.md#commit-message-format) and update commit messages."
  );
}
