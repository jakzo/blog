<script>
  import "../app.scss";
  import Nav from "$lib/Nav.svelte";
</script>

<svelte:head>
  <meta property="og:site_name" content="jakzo" />
</svelte:head>

<Nav />
<slot />
