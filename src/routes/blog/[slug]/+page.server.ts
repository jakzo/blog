import { readPost } from "$lib/markdown";

import type { PageServerLoad } from "./$types";

type MaybeFsError = undefined | (Error & { code?: string });

const sanitizeSlug = (slug: string) =>
  slug.replace(/[^\w-]/g, "").toLowerCase();

// TODO: Can we stream the HTML to the frontend?
export const load: PageServerLoad = async ({ params: { slug } }) => {
  try {
    return { post: await readPost(sanitizeSlug(slug)) };
  } catch (err) {
    if ((err as MaybeFsError)?.code === "ENOENT") return { status: 404 };
    throw err;
  }
};

export const prerender = true;
