```ts
await launch('http://')
   .catch(Error, ex => ex)
   .match('/route', req => req)
   .fetch(req => req)
   .parse(AbstractComponentRender)
   .parse(AbstractFragmentRender)
   .parse(AbstractElementRender)
   .build('link')
   .build('build')
   .build('import')
   .server()
   
```