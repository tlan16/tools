import {
  createHighlighterCore,
  createJavaScriptRegexEngine,
} from 'react-shiki/core';

// Create custom highlighter with dynamic imports to optimize client-side bundle size
export const highlighter = await createHighlighterCore({
  themes: [import('@shikijs/themes/github-light')],
  langs: [
    import('@shikijs/langs-precompiled/shell'),
    import('@shikijs/langs-precompiled/json5'),
    import('@shikijs/langs-precompiled/http'),
    import('@shikijs/langs-precompiled/nginx'),
    import('./public-key.json'),
    import('./private-key.json'),
    import('./url.json'),
  ],
  engine: createJavaScriptRegexEngine({
    target: "ES2025"
  })
});
