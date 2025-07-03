declare global {
   interface Own {
      /** overall status */
      is?: Status

      /** URL for HTML wrapper */
      url?: string

      /** root element as query selector */
      root?: string

      /** route informations */
      route?: Routed

      /** modular states */
      states?: State[]

      /** pipeline handlers */
      handlers?: Handlers

      /** component hydrations */
      hydrations?: Hydration[]

      /** application directories */
      directories?: Directories
   }

   type Routed = Record<string, MetaRoute>

   interface MetaRoute {
      /** list of route metatags */
      metas?: MetaTag

      /** HTML rendered cached */
      cache?: HTMLString

      /** HTML for suspense await */
      await?: HTMLString

      /** false for fallback routing  */
      exact?: boolean

      /** crashed JSX when try to render in server-side */
      crash?: RFE
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