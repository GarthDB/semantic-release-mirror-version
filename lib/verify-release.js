const { promisify } = require("util");
const glob = promisify(require("glob"));
const defaultRegExp = /0\.0\.0-development/g;
const { readFile, writeFile } = require("fs/promises");

/**
 * Called by semantic-release during the verification step
 * @param {*} pluginConfig The semantic-release plugin config
 * @param {*} context The context provided by semantic-release
 */
module.exports = async (pluginConfig, context) => {
  const placeholderRegExp = pluginConfig.placeholderRegExp
    ? pluginConfig.placeholderRegExp
    : defaultRegExp;
  const { fileGlob } = pluginConfig;
  const { logger, nextRelease } = context;
  await glob(fileGlob).then(async (files) => {
    await Promise.all(
      await files.map(async (filename) => {
        const fileContent = await readFile(filename, { encoding: "utf8" });
        // console.log(fileContent.match(placeholderRegExp));
        // console.log(placeholderRegExp.exec(fileContent).groups.version);
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
  logger.log("Some message from plugin.");
  return [];
};
