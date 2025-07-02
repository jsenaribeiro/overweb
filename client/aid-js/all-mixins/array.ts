/// <reference lib='dom' />
/// <reference lib='esnext' />
/// <reference path="array.d.ts" />

Array.range ||= function(...args: any[]) {
   if (!args.length) return []
   const first = args.length == 2 ? args[0] : 0
   const final = args.length == 2 ? args[1] : args[0]
   
   return Array(final).fill(first).map((x,i) => x+i)
}

Array.prototype.distinct ||= function(selector?) { 
   if (!selector) return [...new Set<any>(this)]
   const already = new Set()
   return this.filter(function(item) {
      const key = selector(item)
      if (already.has(key)) return false
      else return already.add(key) || true
   })
}

Array.prototype.count ||= function(predicate) {
   return this.filter(predicate).length
}