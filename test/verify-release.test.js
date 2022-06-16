const test = require("ava");
const { stub } = require("sinon");
const verifyRelease = require("../index").verifyRelease;
const fs = require("fs");

const expected = {};

test.beforeEach((t) => {
  const log = stub();
  t.context.log = log;
  t.context.logger = { log };
  if (!fs.existsSync("./test/tmp/")) fs.mkdirSync("./test/tmp/");
});

test.afterEach((t) => {
  fs.rmSync("./test/tmp/", { force: true, recursive: true });
});

test("Verify release with default RegExp", async (t) => {
  fs.copyFileSync("./test/fixtures/basic.json", "./test/tmp/basic.json");
  t.deepEqual(
    await verifyRelease(
      { fileGlob: "./test/tmp/basic.json" },
      { nextRelease: { version: "12.0.0-beta.34" }, logger: t.context.logger }
    ),
    []
  );
  t.true(t.context.log.calledWith("Some message from plugin."));
});

test("Verify release with custom RegExp", async (t) => {
  fs.copyFileSync("./test/fixtures/regex.json", "./test/tmp/regex.json");
  t.deepEqual(
    await verifyRelease(
      { fileGlob: "./test/tmp/regex.json", placeholderRegExp: /0\.0\.0-dev/g },
      { nextRelease: { version: "12.0.0-beta.34" }, logger: t.context.logger }
    ),
    []
  );
  t.true(t.context.log.calledWith("Some message from plugin."));
});
