import { defineDocumentType, makeSource } from "contentlayer2/source-files";

// ドキュメントの基本型定義
type DocumentWithRaw = {
  _raw: {
    flattenedPath: string;
  };
};

const createComputedFields = () => ({
  slug: {
    type: "string" as const,
    resolve: (doc: DocumentWithRaw) => `/${doc._raw.flattenedPath}`,
  },
  slugAsParams: {
    type: "string" as const,
    resolve: (doc: DocumentWithRaw) =>
      doc._raw.flattenedPath.split("/").slice(1).join("/"),
  },
});

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `blog/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
    },
    date: {
      type: "date",
      required: true,
    },
    published: {
      type: "boolean",
      default: true,
    },
    image: {
      type: "string",
      required: true,
    },
    authors: {
      // Reference types are not embedded.
      // Until this is fixed, we can use a simple list.
      // type: "reference",
      // of: Author,
      type: "list",
      of: { type: "string" },
      required: true,
    },
  },
  computedFields: createComputedFields(),
}));

export const Author = defineDocumentType(() => ({
  name: "Author",
  filePathPattern: `authors/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
    },
    avatar: {
      type: "string",
      required: true,
    },
    twitter: {
      type: "string",
      required: true,
    },
  },
  computedFields: createComputedFields(),
}));

export default makeSource({
  contentDirPath: "./src/content",
  documentTypes: [Post, Author],
});
