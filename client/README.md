# @verweb/client

* js-mixins: prototype extensions
* time-api: useful simple time api
* event-api: EventSouce fluent API facade
* fetch-swr: SWR extention of fetch api
* css-tagger: css-component pattern
* i18n-min: minimalist i18n

## js-mixins

Some js mixins helpers.

| | |
|-|-|
| array | `distinct(selector?)`, `count(predicate)` |
| object | `valueOf(field, value?)`, `Object.isEmpty(obj)` |
| number | `format(commas:boolean, digits)` |
| JSON | `JSON.scriptfy(object\|function)` |
| string | `capitalize()`, `toArray()`, `toObject()`, `toNumber()`, `toRegex()` |

## time-api

Time API with timeString support.

```ts
const 18630000ms = Time.parse('05:10:30')
const 26410000ms = Time.parse('7h20min10s')

await Time.wait(1000, function(){ })
await Time.delay("30s")
```

## event-api

Fluent API facade for EventSource.

```js
const es = eventApi(url, { withCredentials: true })
   .then('open' => console.log('Open connection...'))
   .then('message', e => console.log('Message', e.text))
   .then('status', e => console.log('Message', e.json.progress + '%'))
   .catch(ex => console.error(ex))
   .finally(() => console.log('close'))

es.close() 
```

## fetch-swr

SWR pattern extension for fetch API with fetchApi.

```ts
fetchApi(url, { cache, ['todos'] })   // cache keys
fetchApi(url, { cache: "1min" })      // cache string timeout 
fetchApi(url, { cache: 60000 })       // cache tm
fetchApi(url, { retry: 60000 })       // cache tm

fetchApi.clear('todos', 'ok')    // remove cached keys
fetchApi.clear()                 // remove all caches

fetch.token  // preserves last request.headers.Authorization

// request pooling interval (get only)
await fetch(url, { reget: 1000 })

// request retry after non 200 status
await fetch(url, { retry: { times:3, delay: 1000 }})
```

## synch-api

ORM for RESTful API that abstract the fetch implementation.

```ts
// object mapping of a RESTful API
const userApi = syncher<User>(true)
   .fetch("http://api.com/users")
   .catch(e => "not found...")
   .match(x => x, "id")   

useApi.value      // current state
useApi.await      // pending flag
useApi.sync()     // get request (query)
useApi.sync(true) // post|put|delete request (diff mutation)
```

## i18n-min

Minimalist web standard approach globalization.

```html
<body>
   <script src='i18now.js'></script>
   <p i18n>Welcome</p> <!-- content as key -->
   <p i18n='hello'>Hello world!</p>
   <script>
      i18n.addLanguage('pt')
      i18n.addLanguage('en')
      i18n.load('./langs')
      i18n.current = 'pt'
   </script>
</body>
```

Example of pt.json in ./langs folder.

```
{
   "welcome": "Bem vindo",
   "hello": "Olá mundo!"
}
```

## router-api

Unified router API for in-memory client-side routing.

```ts
router.now                 // current route
router.goto(url)           // new route
router.match('/user/:id')  // check if routed
router.params<T>(route)    // dynamic route object
router.queries             // query string object
```

## multi-spa

Minimalist microfrontend client-side slots and router-api with route attribute for conditional view and link for clickable router.

```html
<body>
   <slot src='http://app.vue.com'>loading...</slot>
   <slot route='/' src='http://app.react.com'>loading...</slot>   
   <slot route='/user/:id' src='http://app.angular.com'>loading...</slot>
   <button link='/user/1'>User 1</button>
</body>
```


## css-tagger

CSS component using web standar with CSS attribute suggar syntax.

```css
grid { display: grid; grid-template-columns: var(--cols, '1fr'); }
```

```html
<grid style="--cols:1fr 1fr"><p>test 1</p><p>test 2</p></grid>
```

```html
<grid --cols="1fr 1fr"><p>test 1</p><p>test 2</p></grid>
```