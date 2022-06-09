<script>
  import "../app.scss";
  import Nav from "$lib/Nav.svelte";
  import GoogleAnalytics from "$lib/GoogleAnalytics.svelte";

  const DESCRIPTION = "My personal blog.";
</script>

<svelte:head>
  <meta property="description" content={DESCRIPTION} />
  <meta property="og:site_name" content="jakzo's blog" />
  <meta property="og:description" content={DESCRIPTION} />
  <meta property="og:locale" content="en_GB" />
</svelte:head>

<GoogleAnalytics />
<Nav />
<slot />
