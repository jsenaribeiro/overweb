/** @module Own reflection type */

/// <reference path="./own.route.d.ts" />
/// <reference path="./own.handler.d.ts" />

declare global {
   interface Own<T=any> {
      is: Status
      url: string 
      root: HTMLQuery
      route: MetaRoute
      states: State[]
      modules: Module[]
      handlers: T
      functions: Function[]
      hydrations: Hydration[]
      directories: Directories
   }        
      
   interface State {
      /** uid = component unique identifier 
       *  @returns component setState    */
      [uid: string]: [() => {}]
   }

   interface Status {
      debug: boolean;
      build: boolean;
      serve: boolean;
      fails: boolean;      
   }

   interface Directories {
      builds: `/${string}`
      routes: `/${string}`
      assets: `/${string}`
   }

   type Hydration = { off: boolean, tag: string, jsx?: JSX }
}

export { }