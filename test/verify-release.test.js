const test = require("ava");
const { stub } = require("sinon");
const verifyRelease = require("../index").verifyRelease;
const { existsSync } = require("fs");
const {
  readFile,
  writeFile,
  copyFile,
  rm,
  mkdir,
  access,
} = require("fs/promises");

const expected = {};

test.beforeEach(async (t) => {
  const log = stub();
  t.context.log = log;
  t.context.logger = { log };
  if (!existsSync("./test/tmp/")) await mkdir("./test/tmp/");
});

test.afterEach(async (t) => {
  await rm("./test/tmp/", { force: true, recursive: true });
});

test("Verify release with default RegExp", async (t) => {
  await copyFile("./test/fixtures/basic.json", "./test/tmp/basic.json");
  t.deepEqual(
    await verifyRelease(
      { fileGlob: "./test/tmp/basic.json" },
      { nextRelease: { version: "12.0.0-beta.34" }, logger: t.context.logger }
    ),
    []
  );
  const result = await readFile("./test/tmp/basic.json", { encoding: "utf8" });
  t.deepEqual(JSON.parse(result), { version: "12.0.0-beta.34" });
  // t.true(t.context.log.calledWith("Some message from plugin."));
});

test("Verify release with custom RegExp", async (t) => {
  await copyFile("./test/fixtures/regex.json", "./test/tmp/regex.json");
  t.deepEqual(
    await verifyRelease(
      { fileGlob: "./test/tmp/regex.json", placeholderRegExp: /0\.0\.0-dev/g },
      { nextRelease: { version: "12.0.0-beta.34" }, logger: t.context.logger }
    ),
    []
  );
  const result = await readFile("./test/tmp/basic.json", { encoding: "utf8" });
  t.deepEqual(JSON.parse(result), { version: "12.0.0-beta.34" });
  // t.true(t.context.log.calledWith("Some message from plugin."));
});

test("Verify release with custom RegExp with matching group", async (t) => {
  await copyFile("./test/fixtures/regex.json", "./test/tmp/regex.json");
  t.deepEqual(
    await verifyRelease(
      {
        fileGlob: "./test/tmp/regex.json",
        placeholderRegExp: /"version": ?"(?<version>[^"]*)"/g,
      },
      { nextRelease: { version: "12.0.0-beta.34" }, logger: t.context.logger }
    ),
    []
  );
  const result = await readFile("./test/tmp/basic.json", { encoding: "utf8" });
  t.deepEqual(JSON.parse(result), { version: "12.0.0-beta.34" });
  // t.true(t.context.log.calledWith("Some message from plugin."));
});
