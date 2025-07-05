type CacheKeys = any[]
type URLArgs = string | URL | globalThis.Request
type OnFetchApi = "request" | "response" | "reject"
type CacheValue = boolean | TimeString | CacheKeys | number 

interface FetchRetry { repeat: number, interval: number }

interface FetchReget { callback: (data: any) => void, interval: number }

interface FetchSettings extends Omit<RequestInit, "cache"> {
   reget?: FetchReget
   retry?: FetchRetry
   cache?: CacheValue
}

interface FetchApi {
   (url: URL): Promise<Response>
   (url: string): Promise<Response>
   (url: Request): Promise<Response>
   (url: URL, settings: FetchSettings): Promise<Response>
   (url: string, settings: FetchSettings): Promise<Response>
   (url: Request, settings: FetchSettings): Promise<Response>
   (url: URL, retries: number, interval: number): Promise<Response>
   (url: string, retries: number, interval: number): Promise<Response>
   (url: Request, retries: number, interval: number): Promise<Response>
   on(type: "reject", fn: (error: Error) => Error | Promise<Error>)
   on(type: "request", fn: (request: RequestInit) => RequestInit)
   on(type: "response", fn: (response: Response) => Response)
   token?: string
   clear(): void
   clear(...keys: string[]): void
   cache: object
   timer: any
   interceptors: any[]
   statistics: {
      regets: number
      retries: number
      requests: number
      clear(): void
   }
}