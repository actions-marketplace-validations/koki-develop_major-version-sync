import { describe, expect, test } from "vitest";
import { extractMajorTag, parseRef } from "./util";

describe("parseRef", () => {
  test.each([
    ["refs/tags/v1.2.3", { type: "tags", name: "v1.2.3" }],
    ["refs/heads/main", { type: "heads", name: "main" }],
    ["refs/pull/123/merge", { type: "pull", name: "123/merge" }],
    ["refs/heads/feature/branch", { type: "heads", name: "feature/branch" }],
  ])("parseRef(%s) should return %o", (ref, expected) => {
    const result = parseRef(ref);
    expect(result).toEqual(expected);
  });
});

describe("extractMajorTag", () => {
  test.each([
    ["1.2.3", "1"],
    ["v1.2.3", "v1"],
    ["1.2.3-beta", "1-beta"],
    ["1.2.3-rc.1", "1-rc.1"],
    ["1.2.3-rc.1.2", "1-rc.1.2"],
    ["v1.2.3-beta", "v1-beta"],
    ["v1.2.3-rc.1", "v1-rc.1"],
    ["v1.2.3-rc.1.2", "v1-rc.1.2"],
    ["v1.2.3-rc.1.2.3", "v1-rc.1.2.3"],
  ])("extractMajorTag(%s) should return %s", (tag, expected) => {
    const result = extractMajorTag(tag);
    expect(result).toBe(expected);
  });
});
