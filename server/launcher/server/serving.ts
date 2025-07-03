import '../shared'
import { bundler } from "../builder"
import { global } from "meta-decorator"
import { renderToString } from "react-dom/server"

export async function serve(hasEnv: boolean) {
   const loadEnv = global.env.load

   await loadEnv(hasEnv)
   await bundler(false)

   const port = global.env.PORT || 3000

   console.log(`Serving at ${global.env.PORT}`)

   Bun.serve({
      port: process.env.PORT || port,
      development: global.own.is.debug,
      async fetch(request: Request) {
         try {
            const matchs = global.own.handlers.match            
            router.goto(new URL(request.url).pathname)

            for (const { route, handler } of matchs) {
               if (!router.match(route)) continue
               return await handler(request)
            }

            for (const handler of global.own.handlers.fetch) {
               const result = await handler(request)
               if (result instanceof Response) return result
               else if (result instanceof Request) request = result
               else throw new Error(`Invalid handler ${handler.name}`)
            }

            throw new Error('Not found request handler response...')
         }
         catch (ex) {
            const cathed = global.own.handlers.catch
               .find(x => x.error.name == ex.name)

            if (!cathed) throw ex

            const html = renderToString(await cathed.handler(ex))

            return new Response(html)
         }
      }
   })

   return Promise.resolve()
}