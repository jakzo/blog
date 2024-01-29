<script lang="ts">
  import Utterances from "./Utterances.svelte";

  export let postTitle: string;
</script>

{#key postTitle}
  <Utterances {postTitle} />
{/key}
