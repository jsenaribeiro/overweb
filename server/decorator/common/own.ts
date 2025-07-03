/** @module Own reflection default */

declare global {
   interface Own {
      modules: Module[]
      functions: Function[]
      decorators: IDecorator[]
   }
}

export const own: Own = {
   decorators: [],
   functions: [],
   modules: []
}