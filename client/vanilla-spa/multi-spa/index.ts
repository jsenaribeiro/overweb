/// <reference path="../router-api/index.ts" />

(function (history) {
   const originalPushState = history.pushState;
   history.pushState = function (...args) {
      const result = originalPushState.apply(this, args);
      window.dispatchEvent(new Event('pushstate'));
      return result;
   };
})(window.history);

const metatags = Array.from(document
   .querySelectorAll('meta'))
   .map(node => node.outerHTML)

document['ttl'] = document.title
document['metatags'] = [...new Set(metatags)]
   .reduce((last, next) => last + next, '')

function __initialSlotProcess(e) {
   document.querySelectorAll('slot[src]')
      .forEach(x => eachSlot(x as HTMLElement));
   
   document.querySelectorAll('[link]')
      .forEach(x => eachLink(x as HTMLElement))
   
   function eachLink(node: HTMLElement) {
      const link = node.getAttribute('link')
      if (!link) return

      node.setAttribute('onclick', `router.goto('${link}')`)
      node.removeAttribute('link')
   }

   function eachSlot(slot: HTMLElement) {
      const src = slot.getAttribute('src')
      const done = slot.getAttribute('done')
      const route = slot.getAttribute('route') || ''
      const regexMT = /<title>.+?<\/title>|<meta .+?\/>|<meta .+?>/g
      const isRouted = router.match(route) || !route;

      if (!src) return
      if (done) switchRoute()
      else fetch(src).then(x => x.text()).then(setLoadHTML)

      function setLoadHTML(html: string) {
         const div = document.createElement('div')
         const shadow = div.attachShadow({ mode: 'open' })
         const metatags = Array
            .from(html.matchAll(regexMT))
            .filter(value => !!value && !!value[0])
            .reduce((last, next) => last + next[0], '')

         slot.innerHTML = ''
         slot.hidden = !isRouted
         slot.setAttribute('done', 'true')
         slot.setAttribute('metatags', metatags)
         slot['metatags'] = metatags
         slot.append(div)

         shadow.innerHTML = html
      }

      function switchRoute() {
         slot.hidden = !isRouted
         if (slot.hidden) return

         var oldHead = document.head.innerHTML
         var newHead = oldHead.replace(regexMT, '')

         if (slot['metatags'] && !slot.hidden)
            newHead += slot['metatags']

         if (!document.head.innerHTML.includes('<title>'))
            newHead += `<title>${document['ttl']}</title>`

         const metaregex = /<meta name=['"](.+?)['"].+?\/*>/g
         const oldMetatags = document["metatags"]

         for (const found of oldMetatags.matchAll(metaregex)) {
            const [full, name] = found
            const pattern = `<meta name=['"]${name}['"].+?\\/*>`
            const checked = new RegExp(pattern, 'g')
            const already = document.head.innerHTML.match(checked)
            if (already) continue
            newHead += full
         }

         console.log({ newHead, newMetas: slot['metatags'] })

         document.head.innerHTML = newHead
      }
   }
}

window.addEventListener('DOMContentLoaded', __initialSlotProcess)
window.addEventListener('pushstate', __initialSlotProcess);
window.addEventListener('popstate', __initialSlotProcess);

