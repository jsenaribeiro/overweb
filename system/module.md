<style>
   aside { display:grid; gap: 15px; }
   [cols='2'] { grid-template-columns: 1fr 1fr; }
   [cols='3'] { grid-template-columns: 1fr 1fr 1fr; }
   aside * {
      align-self: start !important;
   }
</style>


## @overweb/client

<aside cols='3'>

```
js+ (mixins)
+ time
^ array
^ object
^ string
^ number
```

```
web+ (apis)
+ sync
+ event
+ router
+ fetchSWR
```

```
html+
- i18n-min
- css-tag
- slot+
```

</aside>

## @overweb/server

<aside cols=3>

```
jss-helpers
- File
- Path
- 
```

```
jss-launch
- pipeline: parser, render, server
- metadata: env, ioc, own
- standard: File, Path, etc
- defaults: bun, jsx
```

```
jsx-framework
- jss-css-import
- jss-function-decorator
- jss-attribute-handler
- jss-reactive-object
- jss-html-container
- jss-binding-props
- jss-meta-server
```

</aside>

```ts
fetch('http;''''')
```