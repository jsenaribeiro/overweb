import '@overweb/client'

declare global {
   type RenderType = "component" | "fragment" | "element"

   interface Params<T extends JsxType = JsxType, P = any> {
      id: number // current index tree
      jsx: JSX<T, P> // current JSX object
      root: string // component root tag
      feeds: Feeds // dependency injection
      parent: string // parent component Tag
      earlier: any // original props before handlers
   }

   abstract class AbstractRender<T extends JsxType, P = any> implements Params<T, P> {
      constructor(type: RenderType) { this.renderer = type }      
      public id: number 
      public jsx: JSX<T, P> 
      public root: string 
      public feeds: Feeds 
      public parent: string 
      public earlier: any 
      public renderer: RenderType
   }

   abstract class ComponentRender extends AbstractRender<Component> {
      constructor() { super('component') }
   }

   abstract class FragmentRender extends AbstractRender<symbol> {
      constructor() { super('fragment') }
   }

   abstract class ElementRender extends AbstractRender<string> {
      constructor() { super('element') }
   }

   interface Renderer {
      parent < T = any > (args: Params<T>): JSX<any> | JSX < any > []
      children < T = any > (args: Params<T>): JSX[]
      syblings < T = any > (args: Params<T>): JSX[]
   }
}

export {}