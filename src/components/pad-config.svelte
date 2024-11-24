<script lang="ts">
  import type { DrumPart } from "$lib";

  interface PadConfigProps {
    configPart: DrumPart;
    audio: Howl;
  }

  let { configPart, audio }: PadConfigProps = $props();
  let volume = $state(audio.volume() * 100);

  $effect(() => {
    audio.volume(volume / 100);
  });
</script>

<div class="flex flex-col gap-2">
  <div class="w-full flex flex-col">
    <label for="src">Source</label>
    <input id="src" type="url" class="input" disabled value={configPart.src} />
  </div>

  <div class="w-full flex flex-col">
    <label for="vol">Volume</label>
    <input id="vol" type="number" class="input" min={0} max={100} bind:value={volume} />
  </div>
</div>
