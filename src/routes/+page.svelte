<script lang="ts">
  import { onMount } from "svelte";
  import {
    initKit,
    joshDum,
    type DrumKit,
    createKeyMapper,
    defaultKeyMappings,
    type DrumPart,
  } from "$lib";
  import DrumPad from "../components/drum-pad.svelte";
  import Modal from "../components/modal.svelte";
  import { PlayIcon, SettingsIcon } from "lucide-svelte";
  import PadConfig from "../components/pad-config.svelte";

  let kit: DrumKit;
  let { eventListener, listen, keyMappings } = createKeyMapper({ defaultKeyMappings });
  let pad: Record<string, ReturnType<typeof DrumPad>> = {};
  let state: "play" | "config" = "play";

  function play(part: string) {
    const audio = kit[part];
    audio.play();
    pad[part].press();
  }

  let showModal = false;
  let configPart: DrumPart | null = null;
  function showConfig(part: string) {
    configPart = joshDum.find((x) => x.key === part)!;
    showModal = true;
  }

  listen(play);

  function getKeys(partKey: string) {
    const entries = [...keyMappings.entries()];
    return entries.filter((x) => x[1] === partKey).map((x) => x[0]);
  }

  onMount(() => {
    kit = initKit(joshDum);

    window.addEventListener("keydown", eventListener);
    return () => {
      window.removeEventListener("keydown", eventListener);
    };
  });
</script>

<h1 class="mb-4 text-2xl font-bold">Welcome to Drummer</h1>

<div class="flex w-full flex-col items-center gap-3">
  <div class="drum-pad-grid">
    {#each joshDum as part}
      <DrumPad
        bind:this={pad[part.key]}
        onPress={() => (state === "play" ? play : showConfig)(part.key)}
      >
        {part.name}
      </DrumPad>
    {/each}
  </div>

  <div class="drum-actions-grid">
    <button
      class="btn btn-square btn-success"
      onclick={() => (state = "play")}
      disabled={state === "play"}
    >
      <PlayIcon />
    </button>
    <button
      class="btn btn-square btn-warning"
      onclick={() => (state = "config")}
      disabled={state === "config"}
    >
      <SettingsIcon />
    </button>
  </div>
</div>

{#if configPart !== null}
  <Modal bind:showModal>
    {#snippet header()}
      <h2>Settings <small>{configPart?.name}</small></h2>
    {/snippet}

    {#key configPart}
      <PadConfig {configPart} audio={kit[configPart.key]} />
    {/key}
  </Modal>
{/if}

<style lang="postcss">
  .drum-pad-grid {
    @apply grid w-full max-w-96 grid-cols-3 gap-2 rounded-box border-4 border-neutral p-2 lg:max-w-2xl lg:grid-cols-6;
  }

  .drum-actions-grid {
    @apply flex w-full max-w-96 flex-wrap gap-2 rounded-box border-4 border-neutral p-2 lg:max-w-2xl;
  }
</style>
