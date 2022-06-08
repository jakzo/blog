import adapter from "@sveltejs/adapter-static";
import preprocess from "svelte-preprocess";

const isDev = process.env.NODE_ENV === "development";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess(),

  kit: {
    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: null,
      precompress: false,
    }),

    prerender: {
      default: true,
    },

    paths: {
      base: isDev ? "" : "/blog",
    },
  },
};

export default config;
