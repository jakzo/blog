import { URL } from "url";

import { type Plugin, unified } from "unified";
import type { Root as MdastRoot } from "mdast";
import type { Root as HastRoot } from "hast";
import { visit } from "unist-util-visit";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";

const RELATIVE_BASE_URL = "http://is-relative.com";
const SRC_ATTRIBUTES: Record<string, string> = {
  video: "src",
};

const htmlParser = unified().use(rehypeParse);
const htmlStringifier = unified().use(rehypeStringify);

export const remarkUpdateImageUrls: Plugin<void[], MdastRoot> =
  () => (root) => {
    const slug = root.data?.slug as string | undefined;
    if (!slug) return;
    visit(root, "image", (node) => {
      if (new URL(node.url, RELATIVE_BASE_URL).origin === RELATIVE_BASE_URL)
        node.url = `./${slug}/${node.url}`;
    });
  };

export const rehypeUpdateHtmlUrls: Plugin<void[], HastRoot> = () => (root) => {
  const slug = root.data?.slug as string | undefined;
  if (!slug) return;

  visit(root, "raw", (node) => {
    let isChanged = false;

    const nodeRoot = htmlParser.parse(node.value);
    visit(nodeRoot, "element", (node) => {
      if (!(node.tagName in SRC_ATTRIBUTES) || !node.properties) return;
      const attr = SRC_ATTRIBUTES[node.tagName];
      const url = node.properties[attr];
      if (typeof url !== "string") return;
      if (new URL(url, RELATIVE_BASE_URL).origin === RELATIVE_BASE_URL) {
        node.properties[attr] = `./${slug}/${url}`;
        isChanged = true;
      }
    });

    if (!isChanged) return;
    node.value = htmlStringifier.stringify(nodeRoot);
  });
};
