import path from "path";
import { promisify } from "util";
import * as vfile from "to-vfile";
import { unified } from "unified";
import parse from "remark-parse";
import gfm from "remark-gfm";
import remark2rehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import frontmatter from "remark-frontmatter";
import highlight from "rehype-highlight";
import { defaultHandlers, type State } from "mdast-util-to-hast";
import yaml from "js-yaml";
import x86asm from "highlight.js/lib/languages/x86asm";
import powershell from "highlight.js/lib/languages/powershell";

import { POSTS_PATH } from "$lib/util/path";

import type { Post, PostMetadata } from "../types";
import { rehypeHeadingSlugs, remarkTableOfContents } from "./headings";
import { svelte } from "./hljs-svelte";
import { rehypeUpdateHtmlUrls, remarkUpdateImageUrls } from "./media";
import type { MdastRoot } from "mdast-util-to-hast/lib";

const vfileRead = promisify(vfile.read) as unknown as (
  ...args: Parameters<typeof vfile.readSync>
) => Promise<ReturnType<typeof vfile.readSync>>;

const parser = unified().use(parse).use(gfm).use(frontmatter, ["yaml"]);

const runner = unified()
  .use(remarkUpdateImageUrls)
  .use(remarkTableOfContents)
  .use(remark2rehype, {
    allowDangerousHtml: true,
    handlers: {
      root: (h: State, root: MdastRoot) => {
        const result = defaultHandlers.root(h, root);
        if (result && !Array.isArray(result)) result.data = root.data;
        return result;
      },
    } as any,
  })
  .use(highlight, { languages: { x86asm, powershell, svelte } })
  .use(rehypeUpdateHtmlUrls)
  .use(rehypeHeadingSlugs)
  .use(rehypeStringify, { allowDangerousHtml: true });

export const readPost = async (
  postFolderName: string
): Promise<Pick<Post, "metadata" | "content">> => {
  const tree = parser.parse(
    await vfileRead(path.join(POSTS_PATH, postFolderName, "index.md"))
  );
  if (tree.children.length === 0 || tree.children[0].type !== "yaml")
    return {
      metadata: {
        title: "⚠️ Error!",
        date: "2000-01-01",
        excerpt: "Missing Frontmatter!",
      },
      content: "Missing Frontmatter!",
    };
  const meta = yaml.load(tree.children[0].value) as PostMetadata;
  return {
    metadata: {
      icon: meta.icon,
      title: meta.title,
      date: meta.date,
      excerpt: meta.excerpt,
    },
    content: runner.stringify(
      runner.runSync({
        ...tree,
        children: tree.children.slice(1),
        data: { ...tree.data, slug: postFolderName },
      })
    ),
  };
};
