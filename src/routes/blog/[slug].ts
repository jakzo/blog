import { readPost } from "$lib/markdown";
import type { Post } from "$lib/types";

import type { RequestHandler } from "./__types/[slug]";

type MaybeFsError = undefined | (Error & { code?: string });

const sanitizeSlug = (slug: string) =>
  slug.replace(/[^\w-]/g, "").toLowerCase();

// TODO: Can we stream the HTML to the frontend?
export const get: RequestHandler<{
  post: Pick<Post, "metadata" | "content">;
}> = async ({ params: { slug } }) => {
  try {
    return { body: { post: await readPost(sanitizeSlug(slug)) } };
  } catch (err) {
    if ((err as MaybeFsError)?.code === "ENOENT") return { status: 404 };
    throw err;
  }
};
