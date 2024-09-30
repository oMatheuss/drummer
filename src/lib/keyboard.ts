export type KeyMapping = [string, string];

interface KeyboardOptions {
  alwaysUppercase?: boolean;
  defaultKeyMappings?: KeyMapping[];
}

type KeyboardListener = (mapping: string) => void;

export function createKeyMapper(opts: KeyboardOptions = {}) {
  const { alwaysUppercase = true, defaultKeyMappings = [] } = opts;

  const keyMappings = new Map<string, string>(defaultKeyMappings);

  const listeners: KeyboardListener[] = [];
  const listen = (listener: KeyboardListener) => {
    listeners.push(listener);

    return () => {
      const index = listeners.findIndex((value) => value === listener);
      listeners.splice(index, 1);
    };
  };

  const eventListener = ((e: KeyboardEvent) => {
    if (e.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }

    const key = alwaysUppercase ? e.key.toUpperCase() : e.key;

    const mapping = keyMappings.get(key);

    if (!mapping) {
      return; // Quit when this doesn't handle the key event.
    }

    for (const listener of listeners) {
      listener(mapping);
    }

    // Cancel the default action to avoid it being handled twice
    e.preventDefault();
  }) as EventListener;

  return { listen, eventListener, keyMappings };
}
