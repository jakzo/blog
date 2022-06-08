<script>
  import "../app.scss";
  import Nav from "$lib/Nav.svelte";
  import GoogleAnalytics from "$lib/GoogleAnalytics.svelte";
</script>

<svelte:head>
  <meta property="og:site_name" content="jakzo" />
</svelte:head>

<GoogleAnalytics />

<Nav />
<slot />
