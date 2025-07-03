"use server"

import { generateSiteMap } from './sitemap'
import { buildClientSideScript } from "./client"
import { generateRobotTxt } from "./robot"
import { createBundle } from "./bundle"
import { Path, File } from '../shared'
import { global } from 'meta-decorator'

const paths = global.own.directories

/** build the application using bun 
 * @param {boolean} indexOnly only seeks to build the index pages */
export async function bundler(indexOnly: boolean): Promise<true> {
   const buildPath = Path.from(paths.builds)

   global.own.is.build = true // disable import handler (bun.plugin)

   await buildPath.clear()
   await building(indexOnly)   
   await generateSiteMap()
   await generateRobotTxt()
   await buildClientSideScript()
   await createBundle()

   global.own.is.build = false

   return true
}

/** recursive route folders for builder handlers */
async function building(indexOnly: boolean) {
   const routePath = Path.from(paths.routes)
   const indexHTML = await File.load(global.own.url).then(x => x.text())
   const bundlings = Object.entries(global.own.handlers.build.bundle)

   for (const item of await routePath.directory())
   for (const [ext, handler] of bundlings) {
      if (item.isDirectory) await building(indexOnly)
      if (!item.filename.endsWith(ext)) continue
      if (indexOnly && !item.filename.startsWith('index.')) continue
      
      const file = await File.load(item.path)

      await handler(indexHTML, file)
   }
}
