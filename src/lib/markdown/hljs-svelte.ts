import type { LanguageFn } from "highlight.js";

export const svelte: LanguageFn = (hljs) => ({
  name: "Svelte",
  subLanguage: "xml",
  contains: [
    hljs.COMMENT("<!--", "-->", {
      relevance: 10,
    }),
    {
      begin: /(\s*)(<script[^>]*>)/gm,
      end: /(\s*)(<\/script>)/gm,
      subLanguage: "javascript",
      excludeBegin: true,
      excludeEnd: true,
      contains: [
        {
          begin: /^(\s*)(\$:)/gm,
          end: /(\s*)/gm,
          className: "keyword",
        },
      ],
    },
    {
      begin: /(\s*)(<style.*>)/gm,
      end: /(\s*)(<\/style>)/gm,
      subLanguage: "css",
      excludeBegin: true,
      excludeEnd: true,
    },
    {
      begin: /\{/gm,
      end: /\}/gm,
      subLanguage: "javascript",
      contains: [
        {
          begin: /[{]/,
          end: /[}]/,
          skip: true,
        },
        {
          begin: /([#:/@])(if|else|each|await|then|catch|debug|html)/gm,
          className: "keyword",
          relevance: 10,
        },
      ],
    },
  ],
});
