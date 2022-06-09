<script>
  import "../app.scss";
  import Nav from "$lib/Nav.svelte";
  import GoogleAnalytics from "$lib/GoogleAnalytics.svelte";
</script>

<svelte:head>
  <meta property="og:site_name" content="jakzo" />
  <meta property="og:description" content="My personal blog." />
  <meta property="og:locale" content="en_GB" />
</svelte:head>

<GoogleAnalytics />
<Nav />
<slot />
