# micro-frontend
- micro-frontend tags by embbeding and routing 
- micro-component wihout root or page component 
- multi-componentization direct into HTML 
- unified and simplified router api

## features

### a) orchestration

Simple orchestraction using component tag (outer container).

```html
<container route='/admin' src='http://app.ng.com'>
   loading....
</container>

<container route='/user/:id' src='./user.html'>
   loading....
</container>
```

### b) federation

Container without **src** enables federation with component tag (inner container).


```html
<container route='/hello'>
   <component src='./component.js'>
      Inner content...
   </component>

   <component tag='Hello' src='http://app/hello.js' 
      props='number:1; boolean:true; array:[];'>
   </component>
</container>
```

### c) composition

A inner container and components  supports nesting containers

```html
<container route='/hello'>
   <container route='/hello/etc' src='...'>
      loading....
   </container>

   <component src='./component.js'>
      Inner content...
      <container src='...'>
         loading....
      </container>
   </component>
</container>
```

## architecture

- micro-frontend architecture improvement
- micro-component architecture innovation