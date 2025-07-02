/// <reference lib='dom' />
/// <reference lib='esnext' />

import { pd } from "pretty-data";

declare global {
   interface ObjectConstructor {
      get(that: object, path: string)
   }

   interface String {
      decodeHTML(pretty: boolean): string
   }
}

Object.get = function (that: object, path: string) {
   if (!path) return undefined

   const [name, next] = path.split('.')

   return name && next ? Object.get(that[name], next)
      : name ? that[name]
         : undefined
}

String.prototype.decodeHTML = function (pretty) {
   const regex = /&quot;|&amp;|&lt;|&gt;|&apos;/g
   const mapping = {
      '&quot;': '"', '&amp;': '&',
      '&lt;': '<', '&gt;': '>', '&apos;': "'"
   }

   const that = this.replace(regex, m => mapping[m]);

   return pretty ? pd.xml(that) : that
}

export { }