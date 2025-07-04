import { Writable } from '../types'

type WritableFunction = Writable<Function>

export abstract class Decorator<R extends object = any, F extends Function = Function> implements IDecorator {
   public data: R
   private target: F

   abstract handle(): R

   public get name(): string { return this.constructor.name }

   public decorate(fn: F) {
      this.target = fn as any
      return this
   }

   public get call() {
      const func = (...args: any[]) => {
         this.data = this.handle()
         this.target(...args)
      } 

      Object.defineProperty(func, "name", { writable: true });
      
      func.name = this.target.name as any

      Object.defineProperty(func, "name", { writable: false });

      const call = func as WritableFunction
      call.decorators ||= [].concat(this.target.decorators || [])

      const already = call.decorators.some(x => x.name == this.name)
      if (!already) call.decorators.push(this)

      return call
   }
}