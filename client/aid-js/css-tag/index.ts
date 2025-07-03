document.addEventListener('DOMContentLoaded', function () {
   document.querySelectorAll('*').forEach(function (node: HTMLElement) {
      const cssVars = Array.from(node.attributes)
         .filter(x => x.name.startsWith('--'))
      
      if (!cssVars.length) return

      const reducer = (text, attr) => text + `${attr.name}:${attr.value}`

      const styleNow = node.getAttribute('style') || ''   
      const styleVar = cssVars.reduce(reducer, ``)

      node.setAttribute('style', styleNow + styleVar)

      cssVars.forEach(attr => node.removeAttribute(attr.name))

      console.log(node.outerHTML)
   })
})