/// <reference path="./types.ts" />
/// <reference path="../aid-js/fetch-swr/fetch.ts" />

const INVALID_ARGS_NUMBER = 'Invalid name of arguments in Syncher match'
const NO_ID_KEY = 'Not found a valid uid key in Synch'

function synch<T,E=string>(isArray: boolean): ISyncher<T,E>
function synch<T,E=string>(isArray: boolean, settings: FetchSettings): ISyncher<T,E>
function synch<T,E=string>(isArray: boolean, settings?: FetchSettings): ISyncher<T,E> {
   return new Syncher<T,E>(isArray, settings)
}

synch.stats = { mutates: [] as Diff[] }

class Syncher<T,E> implements ISyncher<T,E> {   
   constructor(private isArray: boolean, settings?: FetchSettings) { 
      this.setting = settings || {}
      this.context = {
         await: true,
         value: {} as T,
         heads: null,
         error: undefined,
         async: (x => this.async(x)) as any
      }
   }

   private uidKey = 'id'
   private subMap: SubMap<T> = x => x
   private setting: FetchSettings
   private routing: string = ''
   private catched: Function = x => x
   private context: ISync<T,E> = {} as any
   private retries = { repeat: 0, interval: 0 }
   private polling = { interval: 0, callback: (data: any) => {} }
   private caching = { timeout: 0, keys: undefined as string[]|undefined }

   public fetch = (route: string) => (this.routing=route) ? this : this

   public catch(args: any){
      if (typeof args == 'function') this.catched = args
      if (typeof args == 'string') this.catched = x => args
      if (typeof args == 'object') this.catched = _ => this.isArray ? [args] : args

      return this
   }

   public match(...args: any[]) {
      if (args.length == 0) throw INVALID_ARGS_NUMBER
      if (args.length == 1) return this.match(x => x, args[1])

      const [map, uid] = args as [SubMap<T>, string]
      const update = value => this.refresh(false, value)

      if (!this.uidKey) throw NO_ID_KEY

      this.uidKey = uid
      this.subMap = map   
      this.context.async()

      return new Proxy(this.context, {
         get: (obj, key) => {
            const isValue = key == "value"
            const now = () => update(obj[key])
            if (isValue) setTimeout(now, 1)
            return this.context[key]
            
         }
      })
   }

   private refresh(loading: boolean, value?: any) {
      const nullData = value === undefined
      const sameData = this.context.value == value
      const sameWait = this.context.await == loading

      if ((nullData || sameData) && sameWait) return this.context
      // console.log('refresh', value, {nullData, sameData, sameWait})
   
      this.context.await = loading
      this.context.value = nullData 
         ? this.context.value
         : value

      // TODO: refresh here

      return this.context
   }

   private async async(query?: boolean): Promise<void> {
      const [reget, { timeout, keys }] = [this.polling, this.caching]
      const [retry, route, stats] = [this.retries, this.routing, synch.stats]
      
      this.setting = { ...this.setting, cache: timeout, 
                        cacheKeys: keys, reget, retry  }      
      try {         
         this.refresh(true)
         
         const response = await fetch(route, this.setting as any).then(x => x)         
         const contents = response.ok ? await response.json() : undefined

         this.context.heads = this.setting.headers ? new Headers(this.setting.headers) : null

         if (!response.ok) this.context.error = this.catched(contents)

         else if (response.ok && contents && query) 
            this.context.value = contents

         else if (response.ok && !query) {
            const [ route, value ] = [this.routing, this.context.value]
            const getPath = x => `${route}${x.method == 'POST' ? '' : `/${x.id}`}`
            const getBody = x => x.method == 'DELETE' ? '' : JSON.stringify(x)

            stats.mutates = this.diffs(contents, value, this.isArray)

            const requests = stats.mutates
               .map(x => [ getPath(x), getBody(x), x.method ])
               .map(([ url, body, method ]) => fetch(url, { body, method }))

             this.async

            await Promise.all(requests)
         }

      }
      catch(ex: any) {
         const error = ex['message'] ? ex.message
            : typeof ex == 'string' ? JSON.parse(ex)
            : ex

         this.context.error = this.catched(error)
      }

      // console.log('context', this.context)
      this.refresh(false)
   }

   public retry(times: number, timeout: number) {
      this.retries.repeat = times
      this.retries.interval = timeout
      return this
   }

   public reget(interval: number, callback: (data: any) => void) {
      this.polling.interval = interval
      this.polling.callback = callback
      return this
   }

   public cache(timeout: number, keys?: string[]) {
      this.caching.timeout = timeout
      this.caching.keys = keys || undefined
      return this
   }

   private diffs(nowArg: any, newArg: any, isArray?: boolean): Diff[] {
      isArray ??= this.isArray
   
      const getId = x => this.subMap(x)[this.uidKey]
      const equal = x => y => getId(x) == getId(y)
      const found = xs => y => xs.some(equal(y))
      const build = (method) => x => ({ method, value: x, id: getId(x) })
      const notFound = xs => y => !found(xs)(y)
      const founds = [] as Diff[]

      if (isArray === true) {
         const [news, nows] = [newArg.distinct(), nowArg.distinct()] as [any[], any[]]
         
         const createds = news.filter(notFound(nows)).map(build('POST'))   
         const removeds = nows.filter(notFound(news)).map(build('DELETE'))
         const changeds = nows.filter(found(news))
            .map(now => ({ now, new: news.find(equal(now))}))
            .flatMap(x => this.diffs(x.now, x.new, false))
         
         removeds.concat(changeds).concat(createds).forEach(x => founds.push(x))
      }

      else {
         const nowObject = nowArg as object
         const newObject = newArg as Object

         for (const [key, now] of Object.entries(nowObject)) {
            const isGUID = key == this.uidKey
            const [newId, nowId] = [getId(newObject), getId(nowObject)]
            const basic = { method:'', value: newObject, id: newId }
            const again = founds.some(y => y.id == getId(newObject))
            const same = now == newObject[key]

            // console.trace('now', { key, now, isGUID, equal, again })

            if (newId != nowId) founds.push({ ...basic, method:'POST' })
            else if (isGUID || same || again) continue            
            else founds.push({ ...basic, method:'PUT' })
         }         
      }   

      const uniques = [] as Diff[]
      const sameId = (x, y) => x.id == y.id
      const sameMethod = (x, y) => x.method == y.method
      const same = x => y => sameId(x,y) && sameMethod(x,y)

      for (const item of founds) {
         const already = uniques.some(same(item))
         if (already == false) uniques.push(item)
      }

      return uniques
   }
}

(globalThis as any).synch = synch as any as ISync<any, any>