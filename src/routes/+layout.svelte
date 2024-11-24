<script lang="ts">
  import "../app.css";
  let { children } = $props();
</script>

<div class="mx-4 sm:mx-0 my-4">
  <div class="container mx-auto">
    {@render children()}
  </div>
</div>
