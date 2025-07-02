/// <reference path="own.d.ts" />

export class BrowserOwn<T=any> implements Own<T> {
   public is = is
   public url = './index.html'
   public root = '#root'
   public route = {} 
   public states = []
   public modules = []
   public handlers = {} as any
   public functions = []
   public hydrations = []
   public directories: Directories = {
      assets: '/assets',
      builds: '/builds',
      routes: '/routes'
   };
}

const is: Status = {
   build: false,
   debug: false,
   fails: false,
   get serve() { return !globalThis.document }
}

