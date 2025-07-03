declare global {
   type none = undefined | null
   type record = Record<Key, any>
   type primitive = string | number | boolean | none
   type Key = string | symbol | number
   type Class<T = any> = { new(): T }
   type Side = "client" | "server"
   type Types = 'string' | 'number' | 'boolean' | 'object' | 'function' | 'class' | ''
   type Type = primitive | object | Function | Type[]
   type Writable<T> = { -readonly [P in keyof T]: T[P]; }
   type WritableFunction = Writable<Function>
   type Predicate<T> = (entity: T) => boolean
   type Infer<T> = T extends [infer A] ? A : T
   type AnyKeyOf<T, K extends keyof T = keyof T> =
      Pick<T, K> & { [P in Exclude<keyof T, K>]?: never }   
   
   /** Abstract CSS Style Rule */
   interface StyleRule {
      /** CSS query selector */
      selector: string

      /** CSS styling object */
      stylings: record
   }

   interface ProblemDetails {
      type?: string
      title?: string
      status?: number
      detail?: string
      instance?: string
      traceId?: string
      errors?: { fieldName: string, message: string }[]
   }

   type Invalid<T = any> = { error: string, field: string, value: T }
}

export { }