import '@overweb/client'
import { File } from '../shared'
import { ImportHandler } from 'meta-decorator'

declare global {
   interface Settings {
      isEnv: boolean
      query: string
      index: string
   }

   type MatchHandler = (request: Request) => Promise<Response>
   type FetchHandler = (request: Request) => Promise<Request> | Promise<Response>
   type BundleHandler = (html: string, file: File) => Promise<void>
   type CatchHandler = <E extends Error>(error: E) => Promise<JSX> | JSX

   interface Fluent {      
      catch<E extends Error>(errorClass: Class<E>, handler: CatchHandler<E>): Fluent
      match(route: string, handler: MatchHandler): Fluent
      fetch(handler: FetchHandler): Fluent
      parse<T extends ComponentRender>(componentRender: Class<T>): Fluent
      parse<T extends FragmentRender>(fragmentRender: Class<T>): Fluent
      parse<T extends ElementRender>(elementRender: Class<T>): Fluent
      build(phase: 'bundle', ext: string, handler: BundleHandler): Fluent
      build(phase: 'import', ext: string, handler: ImportHandle): Fluent
      serve(): Promise<void>
   }

   interface Handlers {
      catch: { error: Class, handler: CatchHandler }[]
      match: { route: string, handler: MatchHandler}[]
      fetch: FetchHandler[]
      build: {
         bundle: { [ext: string]: BundleHandler }
         import: { [ext: string]: ImportHandler }
      },
      parse: {
         component: ComponentRender
         fragment: FragmentRender
         element: ElementRender
      }
   }
}