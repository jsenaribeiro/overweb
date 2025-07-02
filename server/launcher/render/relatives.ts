import React from "react"
import { flow } from "./shared"
import * as client from './client'
import { fixKey, getTagName } from "../shared"
import '../shared/types'

export function parent(args: AbstractRender<any>) {
   if (!args.jsx) return undefined
   if (args.jsx[Symbol.for("reactive")]) return args.jsx
   if (Array.isArray(args.jsx)) return this.children(args)
   if (typeof args.jsx == "object" && !args.jsx.type) return this.syblings(args)

   const props = args.jsx.props
   const where = x => typeof args.jsx?.type == x
   const fixed = { ...args.jsx, props, key: fixKey(args.jsx) }
   const model = where("string") ? "element"
      : where("symbol") ? "fragment"
      : where("function") ? "component"
      : undefined
      
   args = { ...args, jsx: fixed }

   if (model == "component") {
      args.earlier = args.jsx.props
      args.parent = getTagName(args.jsx)
   }
   
   if (globalThis.document) switch (model) {
      case "element": return client.element(args, flow)
      case "fragment": return client.fragment(args, flow)
      case "component": return client.component(args, flow)
   }

   else return parentAsync(model, args)
}

async function parentAsync<T extends JsxType = JsxType>(type: string, args: Params<T>) {
   const server = await import('./server').then(x => x)

   switch (type) {
      case "element": return await server.element(args, flow)
      case "fragment": return await server.fragment(args, flow)
      case "component": return await server.component(args as any, flow)
   }   

   return undefined
}

export function children<T extends JsxType=Component>(this: Renderer, args: Params<T>) {
   const mapper = jsx => this.parent({ ...args, jsx })
   return React.Children.map(args.jsx, mapper)
}

export function syblings<T extends JsxType=Component>(args: Params<T>) {
   const mapper = ([key, jsx]) => [key, this.parent({ ...args, jsx })]
   const entries = Object.entries(args.jsx).map(mapper)
   return Object.fromEntries(entries)
}