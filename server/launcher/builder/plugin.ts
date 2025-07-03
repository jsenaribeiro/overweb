import { global, ImportHandler } from "meta-decorator"
import { BunPlugin } from "bun";
import fs from 'fs/promises'

const flags = global.own.is
const plugs = global.own.handlers.build.import

export function generatePlugins(): BunPlugin[] {
   return []
}

export const ownPlugin: BunPlugin = {
   name: "all plugins",
   setup(build) {
      const ignore = flags.build

      ignore || console.log('PLUGINS')
      ignore || console.log('- css plugins')

      build.onLoad({ filter: /\.*$/ }, onLoad)
   }
}

async function onLoad({ path }: Bun.OnLoadArgs) {
   const isTest = path.match(/.test.[tj]sx*/)
   const entries = Object.entries(plugs)   
   const handler = entries
      .filter(([ext]) => path.endsWith(ext))
      .map(([_, handler]) => handler)
      .at(0) as ImportHandler

   if (isTest || !handler) return undefined   

   const code = await fs.readFile(path, 'utf-8')
   const term = await handler(path, code)

   if (!term) return undefined

   return { contents: term.code, loader: term.type }
}