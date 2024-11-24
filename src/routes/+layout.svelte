<script lang="ts">
  import "../app.css";
  let { children } = $props();
</script>

<div class="mx-4 my-4 sm:mx-0">
  <div class="container mx-auto">
    {@render children()}
  </div>
</div>
