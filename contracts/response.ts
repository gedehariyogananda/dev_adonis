declare module '@ioc:Adonis/Core/Response' {
  interface ResponseContract {
    api(data?: any | null, message?: string | null, code?: number | null, request?: any | null): any,
    error(message?: string | null, errors?: any | null, code?: number | null): any
  }
}