<script lang="ts" context="module">
  import "$lib/highlight-js.scss";
  import { getFullTitle } from "$lib/util/posts";
</script>

<script lang="ts">
  import CommentsBox from "$lib/CommentBox/index.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  const post = data.post!;

  let date = new Date(post.metadata.date).toLocaleDateString(undefined, {
    timeZone: "UTC",
    dateStyle: "long",
  });
</script>

<svelte:head>
  <title>{post.metadata.title}</title>
  <meta property="og:title" content={post.metadata.title} />
  <meta property="og:type" content="article" />
  <meta property="og:description" content={post.metadata.excerpt} />
  <meta property="og:article:published_time" content={post.metadata.date} />
  <meta property="og:article:author" content="jakzo" />
  <!-- TODO: Add tags from article -->
  <meta property="og:article:tag" content="" />
</svelte:head>

<div class="header">
  <h1 class="title">{getFullTitle(post.metadata)}</h1>
  <p>
    {date} by <a href="https://github.com/jakzo">jakzo</a>
  </p>
</div>

<article>
  {@html post.content}
</article>

<CommentsBox postTitle={post.metadata.title} />

<style lang="scss">
  .header {
    max-width: var(--content-width);
    margin: 0 auto;
  }
  .title {
    margin-bottom: 0;
  }
</style>
