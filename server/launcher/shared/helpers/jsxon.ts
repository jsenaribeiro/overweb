import { renderToString } from 'react-dom/server'
import { PRIMITIVES } from '../../shared'

const map = [
   { key: "$RE", for: Symbol.for("react.element") },
   { key: "$RF", for: Symbol.for("react.fragment") }
]

const deserializer = (_, val) => map.find(x => x.key == val)?.for || val

const serializer = (_, val) => map.find(x => x.for == val)?.key || val

/** facade to renderToString of react-dom/server */
function htmlfyJSX(node: JSX): string {
   if (!node) return ''

   global.own.is.fails = false

   var wrap = jsxSerializing(node)
   var html = renderToString(wrap)

   global.own.is.fails = true

   return html
}

/** serialize a functional JSX to object  */
function jsxSerializing(jsx: JSX | any[] | any) {
   extractFunctionEventsIntoEventProps(jsx)

   const props = jsx?.props
   const feeds = global.ioc
   const basic = PRIMITIVES.includes(typeof jsx)
   const ended = typeof jsx?.type == "string"
   const array = Array.isArray(jsx)
   const typed = typeof jsx?.type
   const named = jsx?.type?.name

   if (!jsx || ended || basic) return jsx
   if (array) return jsx.map(jsxSerializing)
   if (typed != "function" || named == "retype") return jsx

   function retype(p, f) {
      const child = jsx.type({ ...props, ...p }, { ...feeds, ...f })
      const split = Object.entries(child?.props || {})
         .map(([key, obj]) => [key, jsxSerializing(obj)])

      return { ...child, props: Object.fromEntries(split) }
   }

   return { ...jsx, type: retype }
}

function extractFunctionEventsIntoEventProps(jsx) {
   if (jsx?.type != "jsx" || !jsx?.props) return

   const entries = Object.entries(jsx.props)
      .filter(([_, fn]) => typeof fn == "function")

   for (const [key, fnc] of (entries as any)) {
      jsx.props ||= {}
      jsx.props['events'] ||= {}
      jsx.props['events'][key] = fnc.toString()

      delete jsx.props[key]
   }
}

//** serialize JSX into JSON-like JSX */
export const JSXON = {
   parse: (json: string): JSX => JSON.parse(json, deserializer) || {},
   htmlfy: htmlfyJSX,
   stringify: (jsx: JSX, tabs?: number): string =>
      JSON.stringify(jsx, serializer, tabs)
         .replaceAll("$$typeof", "$typeof")
}

globalThis.JSXON = JSXON