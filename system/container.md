# page-container

Page container offers an middlware between native wrapper and component offering page design with.

* literal attributes
* data interpolation
* component rendering
* two-way data binding
* control flow attributes

It allows micro-components approach with

* rootless component: container is the root
* pageless component: container is the page
* stateless component: container is stateful

## Sample

```html
<template route='/' src='./component.js'>
   <h1>${ title }</h1>

   <Component number=1 string='' array=[]
      object={} reference=obj boolean=true />

   <div class=(true && 'toggle')> ... </div>
   <div case=false>... </div>
   <li each=[1,2,3]> ${it.index} | ${it.value} </li>

   <input oninput='self.title = event.target.value' />
</template>
```

```ts
export * from './components'
export const title = 'title'
```

## States

Self state is a local reactive object


```html
<template src='./module.js'> ${ self.ok } </template>   
```

Global reactive object that could be handle in any template.

```html
<template> ${ root.ok } </template>
<template> ${ root.ok } </template>
```

Same module could be shared allowing partial states.


```html
<template src='./same.js'> ${ self.ok } </template>
<template src='./same.js'> ${ self.ok } </template>
```

## Design

* micro-component architecture
* fitness stateful page design
* stateless component

## Dependencies

* w3c-plus ( < 1kb )
* react | preact
* pretty-data