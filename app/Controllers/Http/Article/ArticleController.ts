import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ArticleService from 'App/Services/Article/ArticleService'
import CreateArticleValidator from 'App/Validators/Article/CreateArticleValidator'
import UpdateArticleValidator from 'App/Validators/Article/UpdateArticleValidator'
import { ValidationException } from '@ioc:Adonis/Core/Validator'
import DefaultException from 'App/Exceptions/DefaultException'

export default class ArticleController {
  service = new ArticleService()
  FETCHED_ATTRIBUTE = [
    'title',
    'content',
    'categories',
  ]

  public async index ({ request, response }: HttpContextContract) {
    try {
      const options = request.parseParams(request.all())
      const result = await this.service.getAll(options)
      return response.api(result, 'OK', 200, request)
    } catch (error) {
      return response.error(error.message)
    }
  }

  public async store ({ auth ,request, response }: HttpContextContract) {
    try {
      const authId = auth.user?.id

      await request.validate(CreateArticleValidator)
      const data = request.only(this.FETCHED_ATTRIBUTE)
      const result = await this.service.addedArticles(authId,data)

      return response.api(result, 'Article created!', 201)
    } catch (error) {
      if (error instanceof ValidationException) {
        const errorValidation: any = error
        return response.error(errorValidation.message, errorValidation.messages.errors, 422)
      }
      return response.error(error.message)
    }
  }

  public async show ({params, request, response }: HttpContextContract) {
    try {
      const options = request.parseParams(request.all())
      const result = await this.service.spesifyArticleUser(params.id, options)
      if (!result) {
        return response.api(null, `Article with id: ${params.id} not found`)
      }
      return response.api(result)
    } catch (error) {

      if(error instanceof DefaultException){
        return response.error(error.message, null, error.status)
      }

      return response.error(error.message)
    }
  }

  public async update ({ auth,params, request, response }: HttpContextContract) {
    try {
      const authId = auth.user?.id

      await request.validate(UpdateArticleValidator)
      const data = request.only(this.FETCHED_ATTRIBUTE)
      const result = await this.service.updateArticle(authId,params.id, data)

      if (!result) {
        return response.api(null, `Article with id: ${params.id} not found`)
      }
      return response.api(result, 'Article updated!')
    } catch (error) {
      if (error instanceof ValidationException) {
        const errorValidation: any = error
        return response.error(errorValidation.message, errorValidation.messages.errors, 422)
      }

      // parsing default exception
      if (error instanceof DefaultException) {
        return response.error(error.message, null, error.status)
      }
      
      return response.error(error.message)
    }
  }

  public async destroy ({ auth,params, response }: HttpContextContract) {
    try {
      const authId = auth.user?.id
      const result = await this.service.deleteArticle(authId, params.id)
      if (!result) {
        return response.api(null, `Article with id: ${params.id} not found`)
      }
      return response.api(null, 'Article deleted!')
    } catch (error) {
      if (error instanceof DefaultException) {
        return response.error(error.message, null, error.status)
      }
      return response.error(error.message)
    }
  }
}
