import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CommentService from 'App/Services/Comment/CommentService'
import CreateCommentValidator from 'App/Validators/Comment/CreateCommentValidator'
import UpdateCommentValidator from 'App/Validators/Comment/UpdateCommentValidator'
import { ValidationException } from '@ioc:Adonis/Core/Validator'
import DefaultException from 'App/Exceptions/DefaultException'

export default class CommentController {
  service = new CommentService()
  FETCHED_ATTRIBUTE = [
    'article_id',
    'content',
  ]

  public async store ({ auth,request, response }: HttpContextContract) {
    try {
      const authId = auth.user?.id
      await request.validate(CreateCommentValidator)
      const data = request.only(this.FETCHED_ATTRIBUTE)
      const result = await this.service.storeComment(authId,data)
      return response.api(result, 'Comment created!', 201)
    } catch (error) {
      if (error instanceof ValidationException) {
        const errorValidation: any = error
        return response.error(errorValidation.message, errorValidation.messages.errors, 422)
      }
      return response.error(error.message)
    }
  }

  public async update ({ auth,params, request, response }: HttpContextContract) {
    try {
      const authId = auth.user?.id
      await request.validate(UpdateCommentValidator)
      const data = request.only(this.FETCHED_ATTRIBUTE)
      const result = await this.service.updateComment(authId,params.id,data)
      if (!result) {
        return response.api(null, `Comment with id: ${params.id} not found`)
      }
      return response.api(result, 'Comment updated!')
    } catch (error) {
      if (error instanceof ValidationException) {
        const errorValidation: any = error
        return response.error(errorValidation.message, errorValidation.messages.errors, 422)
      }

      if (error instanceof DefaultException) {
        return response.error(error.message, null, error.status)
      }
      return response.error(error.message)
    }
  }

  public async destroy ({ auth,params, response }: HttpContextContract) {
    try {
      const authId = auth.user?.id

      const result = await this.service.deleteComment(authId,params.id)
      if (!result) {
        return response.api(null, `Comment with id: ${params.id} not found`)
      }
      return response.api(null, 'Comment deleted!')
    } catch (error) {
      return response.error(error.message)
    }
  }
}
