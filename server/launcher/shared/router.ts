import '@overweb/client';

(globalThis as any).location = {
   pathname: '/',
   get search() {
      const result = this.pathname.split('?').at(1)
      return result ? `?${result}` : ''
   }
};

(globalThis as any).history = {
   pushState(...args) {  
      globalThis.location.pathname = args[3]
   }
};