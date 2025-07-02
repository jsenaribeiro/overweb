declare global {
   interface Directories {
      builds: `/${string}`
      routes: `/${string}`
      assets: `/${string}`
   }

   interface Options {
      path: Directories
      root: `#${string}`
      html: `${string}.html`
      mini: boolean
      zlib: boolean
   }

   interface Context {
      options: Options
      packers: { extension: string, handler: PackerHandler }[]
      loaders: { extension: string, handler: LoaderHandler }[]
      renders: { type: JsxType, handler: JsxHandler }[]
      routers: { route: string, handler: RouterHandler }[]
      propers: { tags: string, handler: ProperHandler }[]
   }
}

export {}