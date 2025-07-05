/// <reference path="./type.ts" />
/// <reference path="../time-api/index.ts" />

async function fetchImplementationSWR(...args: any[]) {
   try {
      if (args.length == 3) {
         const [arg, repeat, interval] = args as [any, number, number]
         const url = typeof arg == 'string' ? new URL(arg) : arg
         return fetchImplementationSWR(url, { retry: { repeat, interval } })
      }

      if (typeof args[0] == 'string')
         return fetchImplementationSWR(new URL(args[0]), args[1])

      const [url, settings] = [args[0], args[1] || {}] as [URL, FetchSettings]
      const retry = settings.retry
      const cache = (settings.cache || false) as CacheValue
      const verb = settings.method?.toLowerCase() || 'get'
      const authentication = localStorage.getItem('token')
         || sessionStorage.getItem('token')
         || ''

      const baseSettings: RequestInit
         = cache === false ? { ...settings, cache: "no-cache" }
         : cache === true ? { ...settings, cache: "force-cache" }
         : { ...settings, cache: "no-cache" }

      const authSettings = authentication
         ? { ...baseSettings, authentication }
         : { ...baseSettings }

      const finalSettings = fetchImplementationSWR.interceptors
         .filter(x => x.type == "request")
         .reduce((obj, int) => int.fn(obj), authSettings)

      if (verb != "get") return await refetch(url, finalSettings, retry)      
      
      const key = Array.isArray(settings.cache)
                ? settings.cache?.join('.')
                : url.toString()
      
      const has = key && Object.keys(fetchImplementationSWR.cache)
                               .some(k => k === key)

      if (has) return fetchImplementationSWR.cache[key]

      const timeout = Time.parse(cache as any)
      const content = await refetch(url, finalSettings, retry)
      const cleared = () => { delete fetchImplementationSWR.cache[key] }

      fetchImplementationSWR.timer[key] = setTimeout(cleared, timeout)

      return fetchImplementationSWR.cache[key] = content

      async function refetch(url: URLArgs, settings?: RequestInit, retry?: FetchRetry, reget?: FetchReget) {         
         fetchImplementationSWR.statistics.requests++
         settings = { ...settings }

         const response = await fetch(url, settings) as Response         

         if (response.status == 401)
            sessionStorage.removeItem('token')

         if (!response.ok && retry?.repeat) {
            retry.repeat--
            fetchImplementationSWR.statistics.retries++
            await Time.delay(retry.interval)
            return await refetch(url, settings, retry)
         }
         
         if (reget?.interval && reget?.callback) {
            const callback = async () => reget.callback(await fetch(url, settings))
            setInterval(callback, reget.interval)
         }

         return fetchImplementationSWR.interceptors
            .filter(x => x.type == "response")
            .reduce((obj, int) => int.fn(obj), response)
      }
      
   }
   catch (ex: any) {
      if (ex instanceof Error)
         ex = fetchImplementationSWR.interceptors
            .filter(x => x.type == "reject")
            .reduce((obj, int) => int.fn(obj), ex)

      throw await ex
   }
}

fetchImplementationSWR.cache = {}
fetchImplementationSWR.timer = null
fetchImplementationSWR.interceptors = []

fetchImplementationSWR.on = (type: OnFetchApi, fn: Function) =>
   fetchImplementationSWR.interceptors.push({ type, fn })

fetchImplementationSWR.statistics = {
   regets: 0, retries: 0, requests: 0,
   clear(){ this.regets=0; this.retries=0; this.requests=0; }
}

fetchImplementationSWR.clear = (...keys: string[]) => 
   !keys.length && Object.keys(fetchImplementationSWR?.cache).length
      ? fetchImplementationSWR.clear(...Object.keys(fetchImplementationSWR.cache))
   : keys.forEach(k => {
      delete fetchImplementationSWR.cache[k]
      clearTimeout(fetchImplementationSWR.timer[k])
      delete fetchImplementationSWR.timer[k]
   }) as any


fetchImplementationSWR.clear = function clear(...keys: any[]) {
   const cache = fetchImplementationSWR?.cache || {}
   const timer = fetchImplementationSWR.timer

   if (!Object.keys(cache).length) return   
   if (!keys.length) return clear(...Object.keys(cache))   
   
   else for (const k of keys) {
      cache && delete cache[k]
      clearTimeout(timer[k])
      timer && delete timer[k]

      Object.keys(cache).forEach(function (cacheKey) {
         if (cacheKey.startsWith(k)) clear(cacheKey)
      })
   }
}
   
const fetchSWR: FetchApi = fetchImplementationSWR;

(globalThis as any).fetchSWR = fetchSWR;