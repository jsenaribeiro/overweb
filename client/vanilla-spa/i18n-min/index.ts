function initialLanguageI18N() {
   document.querySelectorAll('[i18n]').forEach(function (node: HTMLElement) {
      node.style.visibility = 'hidden'
   })
}

window.addEventListener('DOMContentLoaded', initialLanguageI18N)

class I18N {
   private _locale: Intl.Locale = new Intl.Locale(navigator.language)
   private _locales = [this._locale] as Intl.Locale[]
   private _languages = [] as any[]

   public get locale() { return this._locale }

   public get current() {
      const ext = this._locale.region || ''
      return this._locale.language + (ext ? `-${ext}` : '')
   }

   public set current(language: string) {
      this._locale = new Intl.Locale(language)
      this.update()
   }

   public addLanguage(language: string) {
      if (this._locales.find(x => x.language == language)) return
      const locale = new Intl.Locale(language)
      this._locales.push(locale)
   }

  public async load<T = any> (folder: string) {
     folder = folder.endsWith('/') ? folder : folder + '/'
  
     const languages1 = await loadEachFolder(folder, this._locales, true)
     const languages2 = await loadEachFolder(folder, this._locales, false)
     this._languages = { ...languages1, ...languages2 }

     this.update()
   }  
   
   private update() {
      const current = this._languages[this.current] || this._languages[this.current.split('-')[0]]      

      document.querySelectorAll('[i18n]').forEach(function (node: HTMLElement) {
         if (current) {
            const props = node.getAttribute('i18n')
            const field = props || node.innerHTML.trim()
            const value = field && (current[field] || current[field.toLowerCase()])
            if (value) node.innerText = value
         }

         if (node.outerHTML.includes('style="visibility: hidden;"'))
            node.removeAttribute('style')

         else node.style.visibility = 'visible'
      })
   }
}

async function loadEachFolder(folder: string, locales: Intl.Locale[], basic: boolean) {
   const languages = {} as any

   for (const locale of locales) {
      if (!basic && !locale.region) continue

      try {
         const nme = basic ? locale.language : `${locale.language}-${locale.region}`
         const url = folder + nme + '.json'
         const txt = await fetch(url).then(x => x.text())
         const obj = JSON.parse(txt)

         languages[nme] = obj
      }
      catch(ex) { }
   }

   return languages
}

const i18n = new I18N();

(window as any).i18n = i18n;