interface KeyboardOptions {
  alwaysUppercase?: boolean;
}

type KeyboardListener = (mapping: string) => void;

export function createKeyMapper(opts: KeyboardOptions = {}) {
  const { alwaysUppercase = true } = opts;

  const _keyMappings = new Map<string, string>();

  const listeners: KeyboardListener[] = [];
  const listen = (listener: KeyboardListener) => {
    listeners.push(listener);

    return () => {
      const index = listeners.findIndex((value) => value === listener);
      listeners.splice(index, 1);
    };
  };

  const eventListener = (e: KeyboardEvent) => {
    if (e.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }

    const key = alwaysUppercase ? e.key.toUpperCase() : e.key;

    const mapping = _keyMappings.get(key);

    if (!mapping) {
      return; // Quit when this doesn't handle the key event.
    }

    for (const listener of listeners) {
      listener(mapping);
    }

    // Cancel the default action to avoid it being handled twice
    e.preventDefault();
  };

  const bind = (options?: boolean | EventListenerOptions | undefined) => {
    window.addEventListener("keydown", eventListener, options);
    return window.removeEventListener.bind(
      null,
      "keydown",
      eventListener as EventListener,
      options,
    );
  };

  const set = _keyMappings.set.bind(_keyMappings);

  return { set, listen, bind };
}
