/// <reference path="shared.d.ts" />

import { global } from "meta-decorator"
import { serve } from './serving'
import '@overweb/client'
import '../shared/types'

export function launch(settings: Partial<Settings>): Fluent
export function launch(hasEnvFile: boolean): Fluent
export function launch(hasEnvFile: boolean, root: `#${string}`): Fluent
export function launch(hasEnvFile: boolean, root: `#${string}`, index: `${string}.html`): Fluent
export function launch(args: boolean | Partial<Settings>, root?: `#${string}`, index?: `${string}.html`): Fluent {
   const hasEnv = typeof args == 'boolean' ? args : args.isEnv
   const handlers = global.own.handlers

   global.own.url = index || global.own.url
   global.own.root = root || global.own.root

   if (typeof args == 'object') {
      const settings = args as Settings
      global.own.url = settings.index || global.own.url
      global.own.root = settings.query || global.own.root
      Object.merge(global.own.directories, settings)
   }

   return {
      catch(error, handler) {
         handlers.catch.push({ error, handler})
         return this
      },

      match(route, handler) {
         handlers.match.push({ route, handler })
         return this
      },

      fetch(handler) {
         handlers.fetch.push(handler)
         return this
      },

      build(phase, ext, handler) {
         handlers.build[phase][ext] = handler
         return this
      },

      parse(renderClass) {
         if (renderClass instanceof ComponentRender)
            handlers.parse.component = renderClass

         if (renderClass instanceof FragmentRender)
            handlers.parse.fragment = renderClass

         if (renderClass instanceof ElementRender)
            handlers.parse.element = renderClass

         return this
      },

      async serve() { return await serve(hasEnv) }      
   }
}