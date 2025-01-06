import * as core from "@actions/core";
import { context } from "@actions/github";
import { GitHub } from "./github";
import { extractMajorTag, parseRef } from "./util";

export const main = async () => {
  try {
    const inputs = {
      version: core.getInput("version"),
      token: core.getInput("token"),
    } as const;

    const github = new GitHub({
      owner: context.repo.owner,
      repo: context.repo.repo,
      token: inputs.token,
    });

    const version = (() => {
      if (inputs.version) return inputs.version;
      const ref = parseRef(context.ref);
      if (ref.type !== "tags") {
        throw new Error("not a tag event");
      }
      return ref.name;
    })();
    const majorTag = extractMajorTag(version);
    core.setOutput("tag", majorTag);

    const exists = await github.isTagExists(majorTag);
    if (exists) {
      // Update
      core.info(`Updating tag ${majorTag} to ${context.sha}`);
      await github.updateTag({ tag: majorTag, sha: context.sha });
      core.info("Tag updated successfully");
    } else {
      // Create
      core.info(`Creating tag ${majorTag} at ${context.sha}`);
      await github.createTag({ tag: majorTag, sha: context.sha });
      core.info("Tag created successfully");
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      throw error;
    }
  }
};

await main();
