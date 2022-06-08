<script type="ts" context="module">
  import { base } from "$app/paths";
  import type { Post } from "$lib/types";
  import { getFullTitle } from "$lib/util/posts";
</script>

<script type="ts">
  export let posts: Post[];
</script>

<svelte:head>
  <title>jakzo's blog</title>
</svelte:head>

<main>
  <h1>My Posts</h1>
  {#each posts as post}
    <a href="{base}/blog/{post.slug}" class="post">
      <p class="date">
        {new Date(post.metadata.date).toLocaleDateString(undefined, {
          timeZone: "UTC",
          dateStyle: "long",
        })}
      </p>
      <h2 class="title">{getFullTitle(post.metadata)}</h2>
      <p class="excerpt">{post.metadata.excerpt}</p>
    </a>
  {/each}
</main>

<style lang="scss">
  main {
    max-width: var(--content-width);
    margin: 0 auto;
  }

  h1 {
    margin-bottom: 0;
  }

  .date {
    color: #f8f8f2;
    margin: 0;
    margin-top: 32px;
  }

  .title {
    margin: 0;
  }

  .post:hover > .title {
    color: #40b3ff;
  }

  .excerpt {
    color: #c4c8d7;
    margin: 0;
  }
</style>
