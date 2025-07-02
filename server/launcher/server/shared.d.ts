import '@overweb/client'

declare global {
   interface Settings {
      isEnv: boolean
      query: string
      index: string
   }

   interface Fluent {      
      catch<E extends Error>(errorClass: Class<E>, handler: (error: E) => JSX): Fluent
      match(route: string, handler: (request: Request) => Response): Fluent
      fetch(handler: (request: Request) => Request | Response): Fluent
      parse<T extends ComponentRender>(componentRender: Class<T>): Fluent
      parse<T extends FragmentRender>(fragmentRender: Class<T>): Fluent
      parse<T extends ElementRender>(elementRender: Class<T>): Fluent
      build(phase: 'bundle', handler: (file: File) => Promise<void>): Fluent
      build(phase: 'import', handler: ImportHandle): Fluent
   }
}