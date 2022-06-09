import { headingRank } from "hast-util-heading-rank";
import { toString } from "hast-util-to-string";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import type { Root } from "hast";
import type {
  Root as MdastRoot,
  Parent,
  List,
  ListItem,
  BlockContent,
} from "mdast";
import { toString as mdastToString } from "mdast-util-to-string";

const TOC_REGEX = /^\s*\{%\s*toc\s*%\}\s*$/;

const slugify = (text: string) =>
  text
    .replace(/\W+/g, (match, i) =>
      i == 0 || i + match.length === text.length ? "" : "-"
    )
    .toLowerCase();

export const rehypeHeadingSlugs: Plugin<void[], Root> = () => (tree) => {
  visit(tree, "element", (node) => {
    if (!headingRank(node) || !node.properties) return;
    const slug = slugify(toString(node));
    node.properties.id = slug;
    node.children.unshift({
      type: "element",
      tagName: "a",
      properties: {
        href: `#${slug}`,
        role: "img",
        "aria-label": "Link to heading",
      },
      children: [],
    });
  });
};

interface HeadingTree {
  text: string;
  children: HeadingTree[];
}

export const remarkTableOfContents: Plugin<void[], MdastRoot> =
  () => (root) => {
    let minDepth = Infinity;
    visit(root, "heading", (node) => {
      if (node.depth < minDepth) minDepth = node.depth;
    });

    const headingTree: HeadingTree = { text: "", children: [] };
    const headingStack: HeadingTree[] = [headingTree];
    visit(root, "heading", (node) => {
      const depth = node.depth - minDepth + 1;
      while (depth > headingStack.length) {
        const tree: HeadingTree = { text: "", children: [] };
        headingStack[headingStack.length - 1].children.push(tree);
        headingStack.push(tree);
      }
      while (depth < headingStack.length) headingStack.pop();
      const tree: HeadingTree = { text: mdastToString(node), children: [] };
      headingStack[headingStack.length - 1].children.push(tree);
      headingStack.push(tree);
    });

    const tocPositions: { parent: Parent; idx: number }[] = [];
    visit(root, "paragraph", (node, position, parent) => {
      if (position !== null && TOC_REGEX.test(mdastToString(node)))
        tocPositions.push({ parent: parent ?? root, idx: position });
    });

    const headingTreeToNode = (tree: HeadingTree): List => ({
      type: "list",
      children: tree.children.map(
        (child): ListItem => ({
          type: "listItem",
          children: [
            {
              type: "link",
              url: `#${slugify(child.text)}`,
              children: [{ type: "text", value: child.text }],
            } as unknown as BlockContent, // idk why types disallow this but it works
            ...(child.children.length > 0 ? [headingTreeToNode(child)] : []),
          ],
        })
      ),
    });
    const tocNode = headingTreeToNode(headingTree);

    for (const { parent, idx } of tocPositions) parent.children[idx] = tocNode;
  };
