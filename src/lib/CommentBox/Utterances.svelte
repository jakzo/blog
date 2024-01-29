<script lang="ts">
  import { onMount } from "svelte";

  export let postTitle: string;

  let el: HTMLElement;

  onMount(() => {
    const utterancesScript = document.createElement("script");
    utterancesScript.src = "https://utteranc.es/client.js";
    utterancesScript.async = true;
    utterancesScript.setAttribute("repo", "jakzo/blog");
    utterancesScript.setAttribute("issue-term", postTitle);
    utterancesScript.setAttribute("label", "comments");
    utterancesScript.setAttribute("theme", "github-dark");
    utterancesScript.setAttribute("crossorigin", "anonymous");
    el.appendChild(utterancesScript);
  });
</script>

<div bind:this={el} />
