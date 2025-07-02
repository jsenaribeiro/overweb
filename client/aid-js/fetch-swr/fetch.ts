/// <reference path="./types.ts" />
/// <reference path="../time-api/index.ts" />

async function fetchApi(...args: any[]) {
   try {
      if (args.length == 3) {
         const [url, repeat, interval] = args as [string, number, number]
         return fetchApi(url, { retry: { repeat, interval } })
      }

      const [url, settings] = [args[0], args[1] || {}]
      const retry = settings.retry
      const cache = settings.cache || "no-cache"
      const verb = settings.method?.toLowerCase() || 'get'
      const authentication = localStorage.getItem('token')
         || sessionStorage.getItem('token')
         || ''

      const baseSettings: RequestInit = cache == "no-cache" ? { ...settings, cache: "no-cache" }
         : cache == "force-cache" ? { ...settings, cache: "force-cache" }
            : { ...settings, cache: "no-cache" }

      const authSettings = authentication
         ? { ...baseSettings, authentication }
         : { ...baseSettings }

      const finalSettings = fetchApi.interceptors
         .filter(x => x.type == "request")
         .reduce((obj, int) => int.fn(obj), authSettings)

      if (verb != "get") return await refetch(url, finalSettings, retry)

      const key = settings.cacheKeys?.join('.') || url.toString()
      const has = Object.keys(fetchApi.cache).includes(key)

      if (has) return fetchApi.cache[key]

      const cleared = () => { delete fetchApi.cache[key] }
      const timeout = Time.parse(cache as any)
      const content = await refetch(url, finalSettings, retry)

      fetchApi.timer[key] = setTimeout(cleared, timeout)

      return fetchApi.cache[key] = content

      async function refetch(url: URLArgs, settings?: RequestInit, retry?: FetchRetry, reget?: FetchReget) {         
         fetchApi.statistics.requests++
         settings = { ...settings }

         const response = await fetch(url, settings) as Response         

         if (response.status == 401)
            sessionStorage.removeItem('token')

         if (!response.ok && retry?.repeat) {
            retry.repeat--
            fetchApi.statistics.retries++
            await Time.delay(retry.interval)
            return await refetch(url, settings, retry)
         }
         
         if (reget?.interval && reget?.callback) {
            const callback = async () => reget.callback(await fetch(url, settings))
            setInterval(callback, reget.interval)
         }

         return fetchApi.interceptors
            .filter(x => x.type == "response")
            .reduce((obj, int) => int.fn(obj), response)
      }
      
   }
   catch (ex: any) {
      if (ex instanceof Error)
         ex = fetchApi.interceptors
            .filter(x => x.type == "reject")
            .reduce((obj, int) => int.fn(obj), ex)

      throw await ex
   }
}

fetchApi.cache = {}
fetchApi.timer = null
fetchApi.interceptors = []

fetchApi.on = (type: OnFetchApi, fn: Function) =>
   fetchApi.interceptors.push({ type, fn })

fetchApi.statistics = { regets:0, retries:0, requests:0,
   clear(){ this.regets=0; this.retries=0; this.requests=0; }
}

fetchApi.clear = (...keys: string[]) => 
   !keys.length && Object.keys(fetchApi?.cache).length
      ? fetchApi.clear(...Object.keys(fetchApi.cache))
   : keys.forEach(k => {
      delete fetchApi.cache[k]
      clearTimeout(fetchApi.timer[k])
      delete fetchApi.timer[k]
   }) as any

(globalThis as any).fetchApi = fetchApi as FetchApi;