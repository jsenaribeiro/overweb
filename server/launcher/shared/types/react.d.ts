import '@overweb/client'
import 'meta-decorator'

declare global {
   type UseState<T = any> = [T, SetState<T>]
   type SetState<T = any> = (value: T) => void
   type LetState<T = any> = [T, SetState<T>, LetEvent<T>]
   type LetEvent<T = any, U = T> = (value: T) => U
   type Props<T = object> = T & { children?: any[] }
   type JsxType = string | symbol | Component

   interface Component<P = any, F = any> {
      (props: P, feeds: F): JSX
      (props: P): JSX

      refresh?: () => void // useState(time.now) for refresh
   }

   interface JSX<T extends string | symbol | Component = any, P = any> {
      type: T
      props: P & record
      key: string | null
   }

   type Feeds<TParam = any, TState = any, TLogon = any> = IoC<TParam, TState, TLogon>
}

export { }