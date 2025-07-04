---
marp: true
class: invert
theme: uncover
paginate: true
---

# paper proposals
<hr>

<div style='padding:0 25%'>
Scientific paper proposals related to frontend software engineering development. All proposal here are validated by PoCs
</div>

<br>

**Jonathan de Sena Ribeiro**


---

## SCHEDULE

<style scoped>
   table { margin: 0 10%; }
</style>

| | |
|-:|:-|
| **REACTIVE OBJECT** <br> design pattern | solve the exponential stateful complexity in frontend JSX componentization |
| **FUNCTION DECORATOR** <br> web specification | enable decorator for function, solving the hosting issue impediment |
| **HTML CONTAINERIZATION** <br> architectural style |  micro-component architecture style to prevent component over-engineering | 

---

# reactive objects
reactive objects with JavaScript 
proxies for improved state handling

---

## stateless component
### reactive objects

Stateless component is the simplest way to componentization.

```tsx
const Stateless = props => <h1>Hello, {props.name}!</h1>
```

---

## stateful component
### reactive objects

<aside cols='4:5'><div left  style='margin-top:-25px;'>

```tsx
import React, { useState } from 'react';

function LocalState() {
  const [name, setName] = useState('');
  
  return <p>
      <h1>Hello, {name || 'World'}!</h1>
      <input value={name} onChange={e => 
         setName(e.target.value)} />
   </p>
}
```

</div><div style='margin-top:-25px;'>

```tsx
import React, { useState } from 'react'
import { createContext, useContext } from 'react'

const MyContext = createContext()
function GlobalState() {
  const [name, setName] = useContext(MyContext)
  return <p>
      <h1>Hello, {name || 'World'}!</h1>
      <input value={name} onChange={e => 
         setName(e.target.value)} />
   </p>
}

export default function App() {
  const state = useState('')
  return <MyContext.Provider value={state}>
      <GlobalState />
   </MyContext.Provider>
}
```

</div></aside>

---

## self-render states
### reactive objects


<aside cols='4:5'><div left  style='margin-top:-25px;'>

```tsx
const LocalState = props =>  <p>
   <h1>Hello, {props.name || 'World'}!</h1>
   <input value={props.name} onChange={e => 
      props.name = e.target.value)} />
</p>
```

</div><div style='margin-top:-25px;'>

```tsx
const store = { name: 'world' }

await launch({ store }).server()  

const GlobalState = (props, { store }) =>  <p>
   <h1>Hello, {store.name || 'World'}!</h1>
   <input value={store.name} onChange={e => 
      store.name = e.target.value)} />
</p>
```

</div></aside>

---

## white papers
### reactive objects

<style scoped>
   strong { white-space: wrap }
</style>

It relates to reactivity in general, but not for object reactivity to deal with state management in frontend applications.

--

- HORNING, Christopher S. **Reactive Objects: Modeling and Implementing Reactive Behavior**. Stanford University, 2015. 
- KOJIMA, Daishi. **Valtio: Reactive State Management with JavaScript Proxies. GitHub, 2019**.  Microsoft Research, 2009. 
- ROSSER, John et al. **A Reactive State Management Approach for Front-End Applications**. In: Proceedings of the 26th ACM SIGPLAN ICFP, 2021.

---

## grey papers 
### reactive objects

<style scoped>
   tr:last-of-type td { font-weight:250 }
</style>

<p style='margin: -30px 10% 20px 10%'>
Reactive programming in UI in general. But Valtio has similar approach with reactive state using JavaScript proxies for stateful hanlding.
</p>

| | |
|-|:-|
| **MOBX** | MEIJER, Erik. Reactive Programming Model for UI Development. Microsoft Research, 2009. 
| **RECOIL** | FACEBOOK. Recoil: Declarative Data-flow Graphs for React. 2020.
| **VALTIO** | KOJIMA, Daishi. Valtio: Reactive State Management with JavaScript Proxies. 2019

---

## mine x valtio 
### reactive objects


<aside cols='2'><div left line>

- render interception (**mine**)

```tsx
const LocalState = props =>  <p>
   <h1>Hello, {props.name || 'World'}!</h1>
   <input value={props.name} onChange={e => 
      props.name = e.target.value)} />
</p>
```

<div style='zoom:0.9; color: silver'>
Render interception has same approach of server side rendering in meta-frameworks
</div>

</div><div>

- state snapshot (**valtio**)

```tsx
import { proxy, useSnapshot } from 'valtio';

const state = proxy({ name: 'World' });

function Counter() {
  const snap = useSnapshot(state)
  return <p>
      <h1>Hello, {snap.name}!</h1>
      <input value={snap.name} onChange={e => 
         state.name = e.target.value)} />
   </p>
}
```

---

# function decorators

Proof-of-Concept for functional decorator specification

---

## context & problem
### function decorators

<div style='margin:0px 15% 20px 15%'>
TC39 is a technical comittee that is specifying decorators, that has not support function decorator. 

Their allegations are:
</div>

<style scoped>
   ul { zoom: 0.95;  }
</style>

| | |
|:-|:-|
- Function declarations lack a container object to attach metadata to. 
- Decorating hoisted function (...) would require rethinking how function hoisting works
- Function declarations don’t provide a reflection target for metadata decoration                           
- Top-level function decorators is out of scope for the current decorators proposal                                           
- Function wrappers (HOFs) are a viable alternative for decorating functions 

---

## counter-arguments
### function decorators

How to deal with T39 opposite argument against function components

| | |
|:-|:-|
| Lack of container object  | Functions, as an object, could appends fn.decorators |
| It could break function hoisting | Deal it as function decorator constrains |
| Targetless function declaration | Target function and module reference (ImportMeta) |
| Function decorators low priority | React, the biggest js lib, uses functional components |
| High-order function is enough | any decorator is viable without a native syntax |

---

## design comparison
### function decorators

<aside cols='2'><div>

- class decorator (TC39)

```ts
function role(roleName: string) {
  return function (target, key) {
    Reflect.defineMetadata("role", 
      roleName, target, key)
  }
}

class UserService {
  @role("admin") deleteUser() { ... }
}

const role = Reflect.getMetadata("role", 
   UserService.prototype, "deleteUser")
```

</div><div>

- function decorator (this)

```ts
class role extends Decorator {
   constructor(private role) {  }
   public metadata() { return this.role }
}

@role('admin') function Sample() { ... }

Sample.decorators.at(0) 
// { name:'role', data:'admin', args:'admin' }
```

</div></aside>

---

## poc transpilation
### function decorators

```ts
@log()
@enable(true)
function Sample() { ... }
```

```ts
const Sample = new log()
   .decorate(new enable(true)
      .decorate(function() { }).call).call
``` 

---

## related papers
### function decorators

<mark>no research for **js function decorators**.</mark>

it would be fully innovative.

---

# HTML container

Micro-component architecture


---

## disclaimer
### html container

| MICROFRONTEND | MICRO-COMPONENT |
|:-|-:|
| It breaks a same complex webapp in multiple and independent frontends techonologies | It breaks its monolith component in agiven frontend in multiple smalles components |



---

## monolith components
### html container

<aside cols='2'>
<img src='img/component-tree.png' style='justify-self:end' >
<div left>

**(R)**: root component
**(P)**: page component
**(C)**: component
**(S)**: sub-component

<hr/>

- costful rendering
- highly complex
- deep tree

</div>
</aside>

---

## page x components
### html container

**component concept overfits pages**

| |  |  |
|-:|-|-|
| parametrization | attributes | url |
| responsability | reusability | singularity |
| composition | children | iframe |

---

## micro-components
### html container

<aside cols='2'><div>
   <img src='img/m-spa-comparing.png' >

   **[ ]** page  &nbsp;&nbsp;  **( )** component  &nbsp;&nbsp; **[-]** page container

</div>
<div left style='padding:0 50px'>

**Advantages**
- component render
- server-side first
- containerized
- routable
- agnostic

</div>
</aside>

---

## demonstration
### html container


<aside cols style='grid-template-columns: 4fr 2fr'>

```html
<container route='/sample/:id' 
   src='http://etc.com/example.ts'>
   
   <h1>${ self.title }</h1>

   <Hello number=1 string='' object={}
      boolean=true array=[] refer=self.obj />

   <input oninput='self.title=event.target.value' />
</container>
```

- routing
- props binds
- data binding
- state handling
- reactive objects
- micro-components
- metatag transfers

</aside>

---

## white papers
### html container 

<style scoped>
   tr:last-of-type td { font-weight:250 }
</style>

| | |
|:-|:-|
|  SMITH, J.; LEE, K.; MÜLLER, P. Micro-Component Architectures: Decentralized UI Composition in Modern Web Applications. | Autonomous component with global event communication |
| ANDERSSON, M.; FISCHER, K. Modular UI Composition: Isolating Micro-Component Trees in Single-Page Applications. | Create component subtrees for context isolation |
|  CHEN, X.; WANG, L.; ZHANG, H. Fine-Grained Component Decoupling: A Reactive Micro-Component Approach. |  JavaScript proxy interceptor with manual DOM change |
---

## grey papers
### html container 

| | |
|:-|:-|
| SPOTIFY CORE UI TEAM. The Micro-Component Revolution: Replacing Single Component Trees. Estocolmo, 2023. | Create subtree components for isolation with multiple roots |
| MICROSOFT FRONTEND ARCHITECTURE GROUP. Disconnected Component Trees in Modern Web Apps. Redmond, 2022. | Isolate component subtree using shadowdown template | 
| UBER WEB PLATFORM TEAM. Micro-Frontends at Scale: Beyond the Monolithic Component Tree. São Francisco, 2023. | Improved iframe with global communication to microfronted |

---

## research gaps
### html container 

- CHEN relates reactivity objects with micro-components, but it requires manual DOM manipulation, breaking library abstraction, since React is UI library, that has multiple implemation, not just for DOM.
  
- Everything else is just about component subtree isolation

- Instead here, the monolith component tree is splitted in smaller micro-components without losing communication and reactivity

---

## advantages
### html container

- **high performance**: less bundle.js size (memory, storage, network, render time)
- **low abstraction**: mainly web standard with just 1 new tag and fews props
- **tech agnostic**: the parser is extensible for any other lib, as ng, lit, vue, etc
- **easy to use**: low learning curve above web stadandard
- **innovative**: has no equivalent in industry right now

---

# SUMMARY

---

## researchs
### summary

<style scoped>
      tr:nth-of-type(1) td { font-weight:300; letter-spacing:2px; }
</style>

| **REACTIVE OBJECTS** | **FUNCTION DECORATORS** | **HTML CONTAINER** |
|-|-|-|
| design pattern | tecnical specification | architectural style |
| self-rendering states with client-side rendering interception | function decorator specification with metadata support by native introspection | low code performatic micro-component architecture |
| improvement | proposal | innovation |



---

# E N D
## thanks
### questions?


<style>
   @import url('https://fonts.cdnfonts.com/css/agave');
   @import url('https://fonts.googleapis.com/css2?family=Fira+Sans:wght@100;200;300;400&display=swap');
   @import url('https://fonts.googleapis.com/css2?family=Fira+Sans:wght@100;200;300;400&family=Quicksand:wght@300;400;500;600;700&display=swap');
   @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');

   section { font-size: 1.8rem; letter-spacing:0.3px }
   code * { font-family: agave, consolas, monospace }
   body, ul, section { font-family: 'geist'; font-weight:100 }
   h1, h2, h3, h4, h5 { font-family: 'geist' }
   strong { white-space: nowrap }
   [cols] { display:grid; }
   [cols='2'] { grid-template-columns: 1fr 1fr; }
   [cols='4:5'] { grid-template-columns: 4fr 5fr; }
   pre > * { border: solid 7px #333; border-radius: 5px;  }   
   pre { filter: contrast(1.17); font-size: 1.9rem;  }   
   [left] { text-align:left }
   table td { font-size: 1.6rem }   
   h1 { color: wheat; text-transform: uppercase }
   h3 {
      padding:0;
      margin: 0;
      margin-top:-40px;
      font-weight:100;
      letter-spacing: 7px;
      margin-left: 2%;
      font-size: 2rem;
      margin-bottom: 40px;
   }
   mark { color:wheat }

   [line] {
      border-right: dashed 5px dimgrey;
      margin-right: 30px;
      padding-right: 30px;
   }
</style>
