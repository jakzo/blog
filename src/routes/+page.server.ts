import fs from "fs/promises";
import { readPost } from "$lib/markdown";
import { POSTS_PATH } from "$lib/util/path";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
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
  return { posts };
};

export const prerender = true;
