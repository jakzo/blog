import fs from "fs/promises";
import { readPost } from "$lib/markdown";
import type { Post } from "$lib/types";
import { POSTS_PATH } from "$lib/util/path";
import type { RequestHandler } from "./__types/index";

export const get: RequestHandler<{
  posts: Pick<Post, "slug" | "metadata">[];
}> = async () => {
  const postFolders = await fs.readdir(POSTS_PATH, { withFileTypes: true });
  const posts = await Promise.all(
    postFolders
      .filter((entry) => entry.isDirectory())
      .map(async (folder) => {
        const { metadata } = await readPost(folder.name);
        return { slug: folder.name, metadata };
      })
  );
  posts.sort(
    (a, b) =>
      new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
  );
  return { body: { posts } };
};
