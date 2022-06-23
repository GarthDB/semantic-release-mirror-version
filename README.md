![tests workflow](https://github.com/GarthDB/semantic-release-mirror-version/actions/workflows/test.yml/badge.svg)

# Semantic Release Mirror Version

This plugin can write the next release version number to other files, in addition to the `package.json`.

## Installation

Plugins have to be installed via NPM

```bash
$ npm install semantic-release-mirror-version -D
```

or Yarn.

```bash
$ yarn add semantic-release-mirror-version -D
```

Then add the plugin to your [semantic-release config](https://semantic-release.gitbook.io/semantic-release/usage/configuration).

```json
{
  "branches": ["main", "next"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "semantic-release-mirror-version",
      {
        "fileGlob": ["dist/**.md"]
      }
    ],
    "@semantic-release/github",
    "@semantic-release/npm"
  ]
}
```

## Config

### `fileGlob`

This plugin uses [Glob](https://github.com/isaacs/node-glob#glob-primer) to find files to add the version number to.

### `placeholderRegExp`

A RexExp can be defined for finding a string to replace with the version number. The default RegExp is `/0\.0\.0-development/g` to match the default placeholder version in the `package.json` file.

If `placeholderRegExp` is a `String` it will be converted to a `RegExp` with a global flag using the `RegExp` constructor:

```js
pluginConfig.placeholderRegExp = new RegExp(
  pluginConfig.placeholderRegExp,
  "g"
);
```

## Example

This example has a JSON file located at `./dist/output.json` and will be published with the new version number `2.3.1-beta.2`

```json
{
  "data": {
    "version": "0.0.0",
    "name": "Finn Mertens",
    "alias": "Finn the Human"
  }
}
```

and a config file `.releaserc`

```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "semantic-release-mirror-version",
      {
        "fileGlob": "./dist/output.json",
        "placeholderRegExp": "(?<=\")0.0.0"
      }
    ],
    "@semantic-release/github",
    "@semantic-release/git"
  ]
}
```

Would result in the NPM package published with the `./dist/output.json` changed to the following:

```json
{
  "data": {
    "version": "2.3.1-beta.2",
    "name": "Finn Mertens",
    "alias": "Finn the Human"
  }
}
```
