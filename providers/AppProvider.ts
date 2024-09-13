import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import ParseParamService from 'App/Base/Services/ParseParamService'
import ParseUrlService from 'App/Base/Services/ParseUrlService'

export default class AppProvider {
  public static needsApplication = true
  constructor (protected app: ApplicationContract) {
  }

  public register () {
    // Register your own bindings
  }

  public async boot () {
    // IoC container is ready
    this.extendRequest()
    this.extendResponse()
  }

  public async ready () {
    // App is ready
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }

  extendResponse() {
    const Response = this.app.container.use('Adonis/Core/Response')

    Response.macro('api', function (data, message = 'OK', code: any = 200, request = null) {
      const parseUrlService = new ParseUrlService()

      if (data) {
        if (data.rows) {
          const url = parseUrlService.parseUrl(request, data.currentPage ?? 1, data.lastPage ?? 1)

          this.status(code).json({
            data: data.rows,
            page: data.currentPage ?? 1,
            total: data.total ? parseInt(data.total) : data.rows.length,
            perPage: data.perPage ?? data.rows.length,
            lastPage: data.lastPage ?? 1,
            nextPage: url.nextUrl,
            previousPage: url.prevUrl,
            statusCode: code,
            message: message
          })
        } else if (data.length || Array.isArray(data)) {
          this.status(code).json({
            data: data,
            page: 1,
            total: data.length,
            perPage: data.length,
            lastPage: 1,
            nextPage: null,
            previousPage: null,
            statusCode: code,
            message: message
          })
        } else {
          this.status(code).json({
            data: data,
            statusCode: code,
            message: message
          })
        }
      } else {
        this.status(code).json({
          data: null,
          statusCode: code,
          message: message
        })
      }
    })

    Response.macro('error', function (message, errors = null, code: any = 400) {
      this.status(code).json({
        statusCode: code,
        message: message,
        errors: errors
      })
    })
  }

  extendRequest() {
    const Request = this.app.container.use('Adonis/Core/Request')

    Request.macro('parseParams', function (request) {
      const parseParamService = new ParseParamService()
      return parseParamService.parse(request)
    })
  }
}
