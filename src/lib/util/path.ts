import path from "path";
// import url from "url";

// export const pathRelativeToCurrentFile = (
//   importMetaUrl: string,
//   ...segments: string[]
// ) => path.join(url.fileURLToPath(new URL(".", importMetaUrl)), ...segments);

// export const POSTS_PATH = pathRelativeToCurrentFile(
//   import.meta.url,
//   "..",
//   "..",
//   "..",
//   "static",
//   "blog"
// );

// TODO: More robust way to get repo root
export const POSTS_PATH = path.join(process.cwd(), "static", "blog");
