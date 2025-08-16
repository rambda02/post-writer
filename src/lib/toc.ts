import { toc } from "mdast-util-toc";
import { remark } from "remark";
import { visit } from "unist-util-visit";
import { Node } from "unist";
import type { Nodes } from "mdast";

const textTypes = ["text", "emphasis", "strong", "inlineCode"];

// 基本的なノード型を拡張
interface BaseNode extends Node {
  type: string;
}

// テキスト値を持つノード
interface TextNode extends BaseNode {
  type: "text" | "emphasis" | "strong" | "inlineCode";
  value: string;
}

// リンクノード
interface LinkNode extends BaseNode {
  type: "link";
  url: string;
  children: BaseNode[];
}

// 段落ノード
interface ParagraphNode extends BaseNode {
  type: "paragraph";
  children: BaseNode[];
}

// リストノード
interface ListNode extends BaseNode {
  type: "list";
  children: ListItemNode[];
}

// リストアイテムノード
interface ListItemNode extends BaseNode {
  type: "listItem";
  children: BaseNode[];
}

// TOCマップノード
interface TocMapNode extends BaseNode {
  type: string;
  children?: BaseNode[];
}

function flattenNode(node: BaseNode): string {
  const p: string[] = [];
  visit(node, (visitedNode: BaseNode) => {
    if (!textTypes.includes(visitedNode.type)) return;
    p.push((visitedNode as TextNode).value);
  });
  return p.join(``);
}

interface Item {
  title: string;
  url: string;
  items?: Item[];
}

interface Items {
  items?: Item[];
}

function getItems(
  node: BaseNode | null | undefined,
  current: Partial<Item>
): Items {
  if (!node) {
    return {};
  }

  if (node.type === "paragraph") {
    const paragraphNode = node as ParagraphNode;
    visit(paragraphNode, (item: BaseNode) => {
      if (item.type === "link") {
        const linkItem = item as LinkNode;
        current.url = linkItem.url;
        current.title = flattenNode(paragraphNode);
      }

      if (item.type === "text") {
        current.title = flattenNode(paragraphNode);
      }
    });

    return current as Items;
  }

  if (node.type === "list") {
    const listNode = node as ListNode;
    current.items = listNode.children.map((i) => getItems(i, {}) as Item);

    return current as Items;
  } else if (node.type === "listItem") {
    const listItemNode = node as ListItemNode;
    const heading = getItems(listItemNode.children[0], {});

    if (listItemNode.children.length > 1) {
      getItems(listItemNode.children[1], heading);
    }

    return heading;
  }

  return {};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getToc = () => (node: Nodes, file: { data: unknown }) => {
  const table = toc(node);
  file.data = getItems(table.map as TocMapNode, {});
};

export type TableOfContents = Items;

export async function getTableOfContents(
  content: string
): Promise<TableOfContents> {
  const result = await remark().use(getToc).process(content);

  return result.data as TableOfContents;
}
