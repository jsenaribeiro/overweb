/// <reference path="./types.ts" />

function eventApi(url) {
   if (typeof url == 'string') return eventApi(new URL(url));

   const functions = {
      open: (() => { }) as () => void,
      status: (e => { }) as EventFunction,
      message: (e => { }) as EventFunction,
      catch: (ex => { }) as (e: Event) => void,
      finally: (() => { }) as (e: Event) => void
   };

   const chain = {
      then<T = any, U extends EventType = EventType>(type: U, f: EventFunction<T> | (() => void)) {
         if (type === 'open') functions.open = f as () => void;
         if (type === 'status') functions.status = f as EventFunction<T>;
         if (type === 'message') functions.message = f as EventFunction<T>;
         return chain as any;
      },
      catch(handle: (error: Event) => void) {
         functions.catch = handle;
         return chain;
      },
      finally(handle: (e: Event) => void) {
         functions.finally = handle;
         return chain;
      },
      open(settings?: EventSourceInit) {
         const es = new EventSource(url, settings);

         es.onerror = e => {
            const final = es.readyState === EventSource.CLOSED;
            return final ? functions.finally(e) : functions.catch(e);
         };

         es.onopen = functions.open;
         es.onmessage = functions.message;
         es.addEventListener('status', functions.status);

         return es;
      }
   };

   return chain;
}

(globalThis as any).eventApi = eventApi as EventApi