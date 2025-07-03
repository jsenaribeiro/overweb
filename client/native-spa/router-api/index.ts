// /// <reference path="types.d.ts" />

//@ts-ignore
const router = <Router>{
   get now() { return globalThis.location.pathname },
   goto(route: string) { globalThis.history.pushState({}, "", route) },
   match(route: string) { return this.of(route).routed },
   params(route: string) { return this.of(route).params },

   get queries() {
      const search = globalThis.location.search
      const entries = new URLSearchParams(search).entries()
      const queries = Object.fromEntries(entries)
      return queries
   },

   of(route: string) {
      const names = [] as string[]
      const regex = '^' + route.replace(/:([^/]+)/g, (_, k) => (names.push(k), '([^/]+)')) + '$'
      const result = this.now.match(new RegExp(regex))
      const entries = result && names.map((k, i) => [k, result[i + 1]])
      const params = entries ? Object.fromEntries(entries) : {}
      return { routed: !!result, params }
   }
};

(globalThis as any).router = router;

interface Router {
   readonly now: string
   goto(route: string): void
   match(route: string): boolean
   params<T extends object = any>(route: string): T
   queries: Record<string, string>
}