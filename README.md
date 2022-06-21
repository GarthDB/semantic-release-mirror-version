![tests workflow](https://github.com/GarthDB/semantic-release-mirror-version/actions/workflows/test.yml/badge.svg)

# Semantic Release Mirror Version

This plugin can write the next release version number to other files, in addition to the `package.json`.

## Config

### `fileGlob`

This plugin uses [Glob](https://github.com/isaacs/node-glob#glob-primer) to find files to add the version number to.

### `placeholderRegExp`

A RexExp can be defined for finding a string to replace with the version number. The default RegExp is `/0\.0\.0-development/g` to match the default placeholder version in the `package.json` file.
