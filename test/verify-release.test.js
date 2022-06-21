const test = require("ava");
const { stub } = require("sinon");
const verifyRelease = require("../index").verifyRelease;
const { existsSync, mkdirSync, rmSync } = require("fs");
const { randomBytes } = require("crypto");
const { readFile, writeFile, copyFile, access } = require("fs/promises");

const expected = {};

test.before(async (t) => {
  if (existsSync("./test/tmp/")) {
    await rmSync("./test/tmp/", { force: true, recursive: true });
  }
});

test.beforeEach(async (t) => {
  const log = stub();
  t.context.log = log;
  t.context.logger = { log };
  if (!existsSync("./test/tmp/")) {
    await mkdirSync("./test/tmp/");
  }
});

test.afterEach(async (t) => {
  await rmSync("./test/tmp/", { force: true, recursive: true });
});

test("Verify release with default RegExp", async (t) => {
  const filename = "./test/tmp/basic.json";
  await copyFile("./test/fixtures/basic.json", filename);
  t.deepEqual(
    await verifyRelease(
      { fileGlob: filename },
      { nextRelease: { version: "12.1.2-beta.43" }, logger: t.context.logger }
    ),
    []
  );
  const basic = JSON.parse(
    await readFile(filename, {
      encoding: "utf8",
    })
  );
  t.snapshot(basic);
  t.true(t.context.log.calledWith("Matched fileGlob files: 1"));
  t.true(t.context.log.calledWith(`File ${filename} match index: 16`));
});

test("Verify release with custom RegExp", async (t) => {
  const filename = "./test/tmp/regex.json";
  await copyFile("./test/fixtures/regex.json", filename);
  t.deepEqual(
    await verifyRelease(
      {
        fileGlob: filename,
        placeholderRegExp: /0\.0\.0-dev/g,
      },
      { nextRelease: { version: "12.0.0-beta.34" }, logger: t.context.logger }
    ),
    []
  );
  const result = JSON.parse(
    await readFile(filename, {
      encoding: "utf8",
    })
  );
  t.snapshot(result);
  t.true(t.context.log.calledWith("Matched fileGlob files: 1"));
  t.true(t.context.log.calledWith(`File ${filename} match index: 16`));
});

test("should log when no strings match", async (t) => {
  const filename = "./test/tmp/regex-no-match.json";
  await copyFile("./test/fixtures/regex.json", filename);
  t.deepEqual(
    await verifyRelease(
      {
        fileGlob: filename,
        placeholderRegExp: /(?<="ver": *")[^"]*/g,
      },
      { nextRelease: { version: "12.0.0-beta.34" }, logger: t.context.logger }
    ),
    []
  );
  const result = JSON.parse(
    await readFile(filename, {
      encoding: "utf8",
    })
  );
  t.snapshot(result);
  t.true(t.context.log.calledWith("Matched fileGlob files: 1"));
  t.true(t.context.log.calledWith(`File ${filename} match index: -1`));
});
