<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";
  interface DrumPadProps extends HTMLButtonAttributes {
    onPress?(
      e: (MouseEvent | TouchEvent) & { currentTarget: EventTarget & HTMLButtonElement },
    ): void;
  }

  let { children, onPress, ...props }: DrumPadProps = $props();

  import { tweened } from "svelte/motion";
  import { bounceOut } from "svelte/easing";

  const size = tweened(1, {
    duration: 100,
    easing: bounceOut,
  });

  export function press() {
    size.set(0.8).then(() => size.set(1));
  }

  function handleTouchStart(e: TouchEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
    e.preventDefault();
    onPress?.(e);
  }
</script>

<button
  ontouchstartcapture={handleTouchStart}
  onmousedowncapture={onPress}
  style="transform: scale({$size}); opacity: {$size}; transform-origin: center"
  {...props}
>
  {@render children!()}
</button>

<style lang="postcss">
  button {
    @apply aspect-square size-full btn btn-primary touch-none;
  }
</style>
