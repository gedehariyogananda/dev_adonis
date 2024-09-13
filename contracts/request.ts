declare module '@ioc:Adonis/Core/Request' {
  interface RequestContract {
    parseParams(request: any): any
  }
}