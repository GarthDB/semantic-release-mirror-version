const { promisify } = require("util");
const glob = promisify(require("glob"));
const defaultRegExp = /0\.0\.0-development/g;
const { readFile, writeFile } = require("fs/promises");

/**
 * Called by semantic-release during the `verifyRelease` step
 * @param {*} pluginConfig The semantic-release plugin config
 * @param {String} pluginConfig.fileGlob Glob pattern used to match files
 * @param {RegExp} pluginConfig.placeholderRegExp RegExp passed by config used for replacing a string in a matched file with the next release version number.
 * @param {*} context The context provided by semantic-release
 * @returns {Array} empty array
 */
module.exports = async (pluginConfig, context) => {
  const placeholderRegExp = pluginConfig.placeholderRegExp
    ? pluginConfig.placeholderRegExp
    : defaultRegExp;
  const { fileGlob } = pluginConfig;
  const { logger, nextRelease } = context;
  await glob(fileGlob).then(async (files) => {
    logger.log(`Matched fileGlob files: ${files.length}`);
    await Promise.all(
      await files.map(async (filename) => {
        const fileContent = await readFile(filename, { encoding: "utf8" });
        logger.log(
          `File ${filename} match index: ${fileContent.search(
            placeholderRegExp
          )}`
        );
        await writeFile(
          filename,
          fileContent.replace(placeholderRegExp, nextRelease.version, {
            encoding: "utf8",
          })
        );
        return filename;
      })
    );
  });
  return [];
};
