// Add type definition for process/browser module
declare module 'process/browser' {
  global {
    namespace NodeJS {
      interface Process {
        browser: boolean;
      }
    }
  }
  export = process;
}
