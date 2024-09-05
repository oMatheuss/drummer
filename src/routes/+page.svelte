<script lang="ts">
  import { initKit, joshDum, type DrumKit, createKeyMapper } from "$lib";
  import { onMount } from "svelte";
  import DrumPad from "../components/drum-pad.svelte";

  let kit: DrumKit;
  let keys = createKeyMapper();
  let volume = 80;

  let pad: Record<string, DrumPad> = {};

  function play(part: string) {
    const audio = kit[part];
    audio.volume(volume / 100);
    audio.stereo();
    audio.play();
    pad[part].press();
  }

  keys.listen(play);

  onMount(() => {
    kit = initKit(joshDum);

    keys.set("B", "kick");
    keys.set("X", "kick");
    keys.set("N", "hihat-closed");
    keys.set("Z", "hihat-closed");
    keys.set("M", "hihat-open");
    keys.set("C", "snare1");
    keys.set("V", "snare1");
    keys.set("R", "splash");
    keys.set("E", "crash1");
    keys.set("U", "crash2");
    keys.set("G", "tom1");
    keys.set("F", "tom1");
    keys.set("H", "tom2");
    keys.set("J", "tom2");
    keys.set("T", "bell");
    keys.set("Y", "ride");

    return keys.bind();
  });
</script>

<h1 class="text-2xl font-bold">Welcome to Drummer</h1>
<p class="mb-4">
  Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>

<div class="flex w-full justify-center mb-4">
  <div class="grid grid-cols-3 gap-2">
    {#each joshDum as part}
      <DrumPad bind:this={pad[part.key]} onPress={() => play(part.key)}>{part.name}</DrumPad>
    {/each}
  </div>
</div>

<div>
  <label for="volume">Adjust volume ({volume}%):</label>
  <input class="range" name="volume" type="range" bind:value={volume} step="1" min={0} max={100} />
</div>
