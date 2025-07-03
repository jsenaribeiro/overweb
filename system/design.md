
```ts
interface LaunchFluent {
   parser: LaunchParser
   render: LaunchRender
   server: LaunchServer
   create: () => Promise<void>
}

interface LaunchParser {
   (ext: `.${string}`, mode: 'import', handler: ImportParser): this
   (ext: `.${string}`, mode: 'export', handler: ExportParser): this
   (ext: `.${string}`, mode: 'deport', handler: DeportParser): this
}

interface LaunchRender {
   <T extends ComponentRender>(side:Side, classRender: T): this
   <T extends ElementRender>(side:Side, classRender: T): this
   <T extends EventRender>(side:Side, classRender: T): this
}

interface LaunchServer {
   fetch(handler: FetchServer): this
   match(route: string, handler: MatchServer): this
   catch<E extends Error>(err: Class<E>, handler: CatchServer<E>): this
}
```

```ts
type MatchServer = (request: Request) => Response
type FetchServer = (request: Request) => Request|Response
type CatchServer<E extends Error = Error> = (e: E) => ErrorResponse

abstract class Render<T> { 
   public id: number
   public jsx: JSX<T, P> 
   public root: string
   public feeds: Feeds 
   public parent: string
   public earlier: any 
}
abstract class ComponentRender extends AbstractRender {}
abstract class ElementRender extends AbstractRender {}
abstract class EventRender extends AbstractRender {}
```

```ts
const folders = { builds, routes, assets }
const startup = { root:'#root', path: './index.html' }
const options = { server:bun, parser:bun, render: jsx }

await launch(startup, folders, options)
   .parser('import', '.js', functionDecoratorPlugin)
   .parser('export', '.html', htmlContainer)
   .parser('deport', '.js', clientSideRoute)
   .render('server', MyComponentRender)
   .render('server', MyElementRender)
   .render('client', MyEventRender)
   .server('match', '/stream/*', streamingSSR)
   .server('fetch', injectTokenBearerJWT)
   .server('catch', RenderError, myErrorHandler)
   .runner(true)

```