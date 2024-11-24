<script lang="ts">
  import { XIcon } from "lucide-svelte";

  interface ModalProps {
    showModal: boolean;
    header: import("svelte").Snippet;
    children: import("svelte").Snippet;
  }

  let { showModal = $bindable<boolean>(false), header, children }: ModalProps = $props();

  let dialog = $state<HTMLDialogElement>();

  function close() {
    showModal = false;
  }

  function handleClickOutside(e: MouseEvent) {
    if (e.target === dialog) dialog.close();
  }

  function handleClose() {
    dialog?.close();
  }

  $effect(() => {
    if (showModal) dialog?.showModal();
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog bind:this={dialog} onclose={close} onclick={handleClickOutside}>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="text-lg font-medium leading-6">
        {@render header?.()}
      </h1>
      <!-- svelte-ignore a11y_autofocus -->
      <button class="btn btn-square btn-xs btn-ghost" autofocus onclick={handleClose}>
        <XIcon />
      </button>
    </div>
    <hr class="border-neutral mt-2 mb-4" />
    {@render children?.()}
  </div>
</dialog>

<style lang="postcss">
  dialog {
    @apply max-w-lg w-full rounded-box border-none p-0;
  }
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.3);
  }
  dialog > div {
    @apply p-4 w-full;
  }
  dialog[open] {
    animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes zoom {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1);
    }
  }
  dialog[open]::backdrop {
    animation: fade 0.2s ease-out;
  }
  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  button {
    display: block;
  }
</style>
