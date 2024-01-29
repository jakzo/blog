<script lang="ts">
  import { base } from "$app/paths";
  import GithubCorner from "$lib/GithubCorner.svelte";
</script>

<nav>
  <a href="{base}/"><h3><span class="avatar" /> Home</h3></a>
</nav>

<GithubCorner />

<style lang="scss">
  nav {
    max-width: var(--content-width);
    margin: 0 auto;
    display: flex;
    align-items: baseline;
    column-gap: 28px;
  }

  a {
    text-decoration: none;
    border-bottom: 2px solid transparent;
    transition: border-color 0.2s linear;

    &:hover {
      border-color: #bd93f9;
    }

    .avatar {
      display: inline-block;
      border-radius: 3px;
      width: 20px;
      height: 20px;
      background: url("/favicon.png");
      background-size: contain;
    }

    h3 {
      color: white;
      transition: color 0.2s linear;
    }
    &:hover h3 {
      color: #bd93f9;
    }
  }

  h3 {
    margin-bottom: 0px;
  }
</style>
