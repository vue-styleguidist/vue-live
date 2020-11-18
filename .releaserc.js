module.exports = {
  branches: [
    { name: "master" },
    { name: "next", channel: "next", prerelease: "alpha" }, // Only after the `next` is created in the repo
  ],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/npm",
    "@semantic-release/github",
  ],
};
