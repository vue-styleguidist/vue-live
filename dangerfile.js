/* eslint-disable */
const fs = require("fs");
const path = require("path");
const validateMessage = require("validate-commit-msg");

const packageChanged = danger.git.modified_files.includes("package.json");
const lockfileChanged = danger.git.modified_files.includes("package-lock.json");

if (packageChanged && !lockfileChanged) {
  warn(`Changes were made to \`package.json\`, but not to \`package-lock.json\`.
If you’ve changed any dependencies (added, removed or updated any packages), please run \`npm install\` and commit changes in package-lock.json file.`);
}

if (!packageChanged && lockfileChanged) {
  warn(`Changes were made to \`package-lock.json\`, but not to \`package.json\`.
Please remove \`package-lock.json\` changes from your pull request. Try to run \`git checkout master -- package-lock.json\` and commit changes.`);
}

// Check test exclusion (.only) is included
var modifiedSpecFiles = danger.git.modified_files.filter(function (filePath) {
  return filePath.match(/__tests__\/.+\.(js|jsx|ts|tsx)$/gi);
});

var testFilesIncludeExclusion = modifiedSpecFiles.reduce(function (acc, value) {
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

//validate commit message in PR if it conforms conventional change log, notify if it doesn't.
var messageConventionValid = danger.git.commits.reduce(function (acc, value) {
  var valid = validateMessage(value.message);
  return valid && acc;
}, true);

let errorCount = 0;

if (!messageConventionValid) {
  warn(
    "commit message does not follows conventional change log (" +
      ++errorCount +
      ")"
  );
  markdown(
    "> (" +
      errorCount +
      ") : vue-live uses conventional change log to generate changelog automatically. It seems some commit messages are not following those. Use `git commit --amend` or `git rebase -i` to fix them."
  );
}
