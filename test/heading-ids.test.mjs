import assert from "node:assert/strict";
import test from "node:test";
import { createUniqueHeadingIds } from "../lib/heading-ids.mjs";

test("keeps unique heading IDs unchanged", () => {
  assert.deepEqual(
    createUniqueHeadingIds([
      { id: "overview", text: "Overview" },
      { id: "how-it-works", text: "How it works" },
    ]),
    ["overview", "how-it-works"],
  );
});

test("adds numeric suffixes to duplicate heading IDs", () => {
  assert.deepEqual(
    createUniqueHeadingIds([
      { id: "criteria", text: "Criteria" },
      { id: "criteria", text: "Criteria" },
      { id: "criteria", text: "Criteria" },
    ]),
    ["criteria", "criteria-2", "criteria-3"],
  );
});

test("does not overwrite an existing suffixed heading ID", () => {
  assert.deepEqual(
    createUniqueHeadingIds([
      { id: "criteria", text: "Criteria" },
      { id: "criteria", text: "Criteria" },
      { id: "criteria-2", text: "Criteria 2" },
    ]),
    ["criteria", "criteria-3", "criteria-2"],
  );
});

test("generates IDs when headings do not already have one", () => {
  assert.deepEqual(
    createUniqueHeadingIds([
      { id: "", text: "Getting Started" },
      { text: "Getting Started" },
      { id: "", text: "日本語" },
    ]),
    ["getting-started", "getting-started-2", "section"],
  );
});
