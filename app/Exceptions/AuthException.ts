import { Exception } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new DefaultException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class AuthException extends Exception {
  public async handle(error: this, ctx: HttpContextContract) {
    const message = error.message.split(': ')[1]
    ctx.response.error(message, error.code, error.status)
  }
}
