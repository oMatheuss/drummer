<script lang="ts">
  import { initKit, joshDum, type DrumKit, createKeyMapper, defaultKeyMappings } from "$lib";
  import { onMount } from "svelte";
  import DrumPad from "../components/drum-pad.svelte";
  import { PlayIcon, PauseIcon, CassetteTapeIcon } from "lucide-svelte";

  let kit: DrumKit;
  let { eventListener, listen, keyMappings } = createKeyMapper({ defaultKeyMappings });
  let volume = 80;
  let bpm = 120;

  let tempo = 1;
  let state: "paused" | "pre-recording" | "recording" | "playing" = "paused";

  function setPlaying() {
    tempo = 1;
    state = "playing";
  }

  function setRecording() {
    state = "pre-recording";
  }

  function setPaused() {
    state = "paused";
  }

  let pad: Record<string, ReturnType<typeof DrumPad>> = {};

  function play(part: string) {
    const audio = kit[part];
    audio.volume(volume / 100);
    audio.stereo();
    audio.play();
    pad[part].press();
  }

  listen(play);

  function getKeys(partKey: string) {
    const entries = [...keyMappings.entries()];
    return entries.filter((x) => x[1] === partKey).map((x) => x[0]);
  }

  function beat(dt: number) {
    if (tempo === 1) {
      kit["hihat-closed"].play();
      kit["kick"].play();
    } else if (tempo === 2) {
      kit["hihat-open"].play();
    } else if (tempo === 3) {
      kit["hihat-closed"].play();
      kit["snare1"].play();
    } else if (tempo === 4) {
      kit["hihat-open"].play();
      tempo = 0;
    }

    tempo++;
  }

  onMount(() => {
    kit = initKit(joshDum);

    window.addEventListener("keydown", eventListener);

    let removed = false;
    let elapsed = 0,
      start = 0;

    window.requestAnimationFrame(function cb(time) {
      let bpmToFps = 60_000 / bpm;

      if (start === 0) start = time;
      elapsed = time - start;

      if (elapsed >= bpmToFps) {
        start = elapsed - bpmToFps + time;

        if (state === "playing") {
          beat(elapsed);
        }
      }

      if (!removed) window.requestAnimationFrame(cb);
    });

    return () => {
      removed = true;
      window.removeEventListener("keydown", eventListener);
    };
  });
</script>

<h1 class="text-2xl font-bold mb-4">Welcome to Drummer</h1>

<div class="flex flex-col md:flex-row w-full justify-center gap-4 mb-4">
  <div class="max-w-96 w-full grid grid-cols-3 gap-2 border-4 border-neutral p-2 rounded-box">
    {#each joshDum as part}
      <DrumPad bind:this={pad[part.key]} onPress={() => play(part.key)}>{part.name}</DrumPad>
    {/each}
  </div>
  <div class="max-w-96 w-full border-4 border-neutral p-2 rounded-box">
    <h2 class="text-2xl mb-2">Keyboard</h2>
    <div class="flex flex-col gap-2 max-h-96 overflow-y-auto">
      {#each joshDum as part}
        <button class="btn flex justify-between">
          {part.name}
          <div class="flex gap-1">
            {#each getKeys(part.key) as key}
              <kbd class="kbd">{key}</kbd>
            {/each}
          </div>
        </button>
      {/each}
    </div>
  </div>
  <div class="flex flex-col gap-2 max-w-96 w-full border-4 border-neutral p-2 rounded-box">
    <h2 class="text-2xl mb-2">Adjusts</h2>
    <div>
      <label for="volume">Volume ({volume}%)</label>
      <input
        class="range range-sm"
        name="volume"
        type="range"
        bind:value={volume}
        step="1"
        min={0}
        max={100}
      />
    </div>
    <div>
      <label for="bpm">BPM</label>
      <input
        class="w-full input input-bordered input-sm"
        name="bpm"
        type="number"
        bind:value={bpm}
        max="999"
        step="1"
      />
    </div>
    <div class="flex gap-2 mt-2">
      <button
        class="btn btn-success btn-circle"
        onclick={setPlaying}
        disabled={state === "playing"}
      >
        <PlayIcon />
      </button>
      <button class="btn btn-error btn-square" onclick={setPaused} disabled={state === "paused"}>
        <PauseIcon />
      </button>
      <button
        class="btn btn-neutral btn-square"
        onclick={setRecording}
        disabled={state === "pre-recording" || state === "recording"}
      >
        <CassetteTapeIcon />
      </button>
    </div>
  </div>
</div>
