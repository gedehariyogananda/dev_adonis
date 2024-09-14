import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CategoryService from 'App/Services/Category/CategoryService'
import CreateCategoryValidator from 'App/Validators/Category/CreateCategoryValidator'
import UpdateCategoryValidator from 'App/Validators/Category/UpdateCategoryValidator'
import { ValidationException } from '@ioc:Adonis/Core/Validator'

export default class CategoryController {
  service = new CategoryService()
  FETCHED_ATTRIBUTE = [
    'name',
    'description'
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

  public async store ({ request, response }: HttpContextContract) {
    try {
      await request.validate(CreateCategoryValidator)
      const data = request.only(this.FETCHED_ATTRIBUTE)
      const result = await this.service.store(data)
      return response.api(result, 'Category created!', 201)
    } catch (error) {
      if (error instanceof ValidationException) {
        const errorValidation: any = error
        return response.error(errorValidation.message, errorValidation.messages.errors, 422)
      }
      return response.error(error.message)
    }
  }

  public async update ({ params, request, response }: HttpContextContract) {
    try {
      await request.validate(UpdateCategoryValidator)
      const data = request.only(this.FETCHED_ATTRIBUTE)
      const result = await this.service.update(params.id, data)
      if (!result) {
        return response.api(null, `Category with id: ${params.id} not found`)
      }
      return response.api(result, 'Category updated!')
    } catch (error) {
      if (error instanceof ValidationException) {
        const errorValidation: any = error
        return response.error(errorValidation.message, errorValidation.messages.errors, 422)
      }
      return response.error(error.message)
    }
  }

  public async destroy ({ params, response }: HttpContextContract) {
    try {
      const result = await this.service.delete(params.id)
      if (!result) {
        return response.api(null, `Category with id: ${params.id} not found`)
      }
      return response.api(null, 'Category deleted!')
    } catch (error) {
      return response.error(error.message)
    }
  }
}
