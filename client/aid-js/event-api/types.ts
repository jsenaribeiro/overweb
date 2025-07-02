interface EventApi {
   (url: URL): FluentChain
   (url: string): FluentChain
}

type EventType = 'open' | 'message' | 'status';

type EventFunction<T = any> = (me: MessageEvent<T>) => void

type MinimalEventSource = Omit<Omit<Omit<Omit<Omit<Omit<Omit<EventSource, 'onopen'>, 'onerror'>, 'addEventListener'>, 'removeEventListener'>, 'dispatchEvent'>, 'onmessage'>, 'readyState'>

interface CreateEventSource {
   open(): MinimalEventSource
   open(settings: EventSourceInit): MinimalEventSource;
}

type CallbackMap = {
   open: () => void;
   message: (e: MessageEvent) => void;
   status: (e: MessageEvent) => void;
};

type FluentChain<
   T extends EventType = EventType,
   C extends boolean = true,
   F extends boolean = true
> = {
   open(): MinimalEventSource;
   open(settings: EventSourceInit): MinimalEventSource;
   then<U extends T>(
      type: U,
      call: CallbackMap[U]
   ): FluentChain<Exclude<T, U>, C, F>;
} & (C extends true
   ? { catch(call: (e: Event) => void): FluentChain<T, false, F> }
   : {}) & (F extends true
      ? { finally(call: (e: Event) => void): CreateEventSource }
      : {}); 