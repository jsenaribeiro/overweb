import { SitemapStream, streamToPromise } from "sitemap"
import { global } from "meta-decorator"
import { Path } from "../shared"
import { pd } from 'pretty-data'
import * as fs from 'fs'

export async function generateSiteMap() {
   if (!global.env?.HOSTNAME) return

   const path = global.own.directories.builds
   const sitemapPath = `${path}/sitemap.xml`
   const writeStream = fs.createWriteStream(sitemapPath)
   const sitemap = new SitemapStream({ hostname: global.env.HOSTNAME })
   const mini = !!global.env.MINIFIED
      
   sitemap.pipe(writeStream)

   await Path.from(path)
      .directory('.html')
      .then(generateEachInformationHTML)
      .then(link => sitemap.write(link))
   
   sitemap.end()

   const buffer = await streamToPromise(sitemap);
   const header = `<?xml version="1.0" encoding="UTF-8"?>`
   const namesp = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`
   const result = header + namesp + buffer.toString() 
   
   await Bun.write(sitemapPath, mini ? result : pd.xml(result));
}

const generateEachInformationHTML = (file) =>({
   url: '/' + file.replace('index.html', '').replace('.html', ''),
   changefreq: 'monthly',
   priority: 0.7
});
