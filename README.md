# @overweb

Overweb is a software engineering research in frontend developement. The **jss** here means javascript on server (or server-side javascript).

| \> package | + innovation | - minimal | = support | ~ improved |
| :--------: | :---: | :-------: | :-------: | :--------: |

Above has the legend to specific contribution library.

## LIBRARIES

**Client-side** javascript libraries.

| aid-js | async-api | native-spa |
|-|-|-|
| + fetch + event APIs <br> + css component patttern <br>  ~ mixins: string, object, array, etc | + mapping <br> + synchorizer <br> + authentication | + router-api: unified router <br> + multi-spa: microfrontend <br> + i18n-aid: i18n props |

Javascript **server-side** libraries

| meta-decorator | html-container | jsx-launcher |
|-|-|-|
| + function decorators <br> - metadata env, ioc, own <br> ~ facade: File, JSXON, etc | + micro-component <br> + web standard <br> + JSX-in-HTML | + loader: build, import, link <br>  + render: comp, elem, frag <br> + server: match, fetch, catch |

React **metaframework** with /client and /server libraries

| innovation | improvement | support | 
|-|-|-|
| + reactive objects <br> + attribute render <br> + modular CSS <br> + dual binding | - await props (suspense alternative) <br> - directory routes (no conventions) <br> - dynamic route (with decorators) <br> - props routing (declarative way) | = prefetch routing <br> = server components <br> = SSR streaming <br> = restful api |


## EXAMPLES

Example of todo list using jsx-framework with global states with reactive objects, data binding props and modular CSS imports

#### **/index.ts** (startup script)

```ts
import { launch } from 'jsx-framework'

const store = { list:[], task:'', done:false }

await launch({ store })
   .handle('[show]', props => ({ ...props, hidden: !props.show}))
   .handle('/hello', req => new Response('world'))   
   .server('./index.html')
```
 
#### **/routes/index.ts** (directory routing)

```tsx
import './index.css'                        

export const TodoList = (props, ({ store })) => <div>
   <h1>Todo List</h1>
   <input data={store} bind='task'/>
   <button onChange={add(store)}>Add</button>      
   { store.list?.map(todoItem) }
</div> 
 
const todoItem = item = <li> 
   <label class={item.done && 'done'}>{ item.name }</label> | 
   <input type='checkbox' checked={item.done} />
</li>

const add = store = e => store.list
   .push({ task:props.task, done:false })
```
 
#### **/routes/index.css** (modular CSS)

```css
.done { text-decoration: line-through }      
```