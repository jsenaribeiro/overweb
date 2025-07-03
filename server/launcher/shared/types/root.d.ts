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

   interface Settings {
      isEnv: boolean
      query: string
      index: string
      paths: Partial<Directories>
   }
}

export { }