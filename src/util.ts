import semver from "semver";

export type Ref = {
  type: string;
  name: string;
};

export const parseRef = (ref: string) => {
  if (!ref.startsWith("refs/")) {
    throw new Error("not a valid ref");
  }
  const [, type, ...name] = ref.split("/");
  return { type, name: name.join("/") };
};

export const extractMajorTag = (tag: string) => {
  if (!semver.valid(tag)) {
    throw new Error("tag must be in the semver format (e.g. v1.2.3)");
  }

  const major = semver.major(tag);
  const prerelease = semver.prerelease(tag);
  const prefix = tag.startsWith("v") ? "v" : "";

  if (prerelease) {
    return `${prefix}${major}-${prerelease.join(".")}`;
  }
  return `${prefix}${major}`;
};
