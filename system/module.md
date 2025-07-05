<style>
   aside { display:grid; gap: 15px; }
   [cols='2'] { grid-template-columns: 1fr 1fr; }
   [cols='3'] { grid-template-columns: 1fr 1fr 1fr; }
   aside * {
      align-self: start !important;
   }

   h1 { border:0; text-align: center; font-size: 2.1rem }
</style>

# @overweb


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
+ router
+ broker
+ fetcher
+ syncher
```

```
html+
- i18n-min
- css-tag
- slot+
```

</aside>

## @overweb/server

<aside cols style='grid-template-columns: 3fr 3fr 4fr'>

```
jss-aid
- File|Path
- JSON|JSXON
- ioc|own|env
```

```
jss-launch
- parser
- render
- server
```

```
jsx-framework
- css-import
- fn-decorator
- props-handler
- reactive-object
- html-container
- binding-props
- meta-server
```

</aside>