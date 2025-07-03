type SubMap<T> = (obj: T) => T | T[keyof T]

interface ISync<T, E> {
   value: T
   await: boolean
   heads: Headers | null
   error: E | undefined
   async(): Promise<void>
   async(mutate: true): Promise<void>
}

interface Diff { id: string | number, method: string, value: any }

interface ISFetchFull<T, E> extends ISFetch<T, E> {
   cache(timeout: number): ISFetch<T, E>
   cache(timeout: number, keys: string[]): ISFetch<T, E>
   retry(repeat: number, interval: number): ISFetch<T, E>
   reget(interval: number, callback: () => void): ISFetch<T, E>
}

interface ISFetch<T, E> {
   fetch(url: `www.${string}`): ISCatch<T, E>
   fetch(url: `http://${string}`): ISCatch<T, E>
   fetch(url: `https://${string}`): ISCatch<T, E>
}

interface ISCatch<T, E> {
   catch(fallback: T): ISMatch<T, E>
   catch(exception: E): ISMatch<T, E>
   catch(map: (obj: T) => T): ISMatch<T, E>
}

interface ISMatch<T, E> {
   match(map: (obj: T) => T, uid: keyof T): ISync<T, E>
   match<U extends T[keyof T]>(map: (obj: T) => U, uid: keyof U): ISync<T, E>
}

interface ISyncher<T, E> extends ISFetchFull<T, E> { }