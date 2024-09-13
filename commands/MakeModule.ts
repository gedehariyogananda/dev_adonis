import { BaseCommand, args, flags } from '@adonisjs/core/build/standalone'
import fs from 'fs'

export default class MakeModule extends BaseCommand {
  public static commandName = 'make:module'
  public static description = 'Make a new module'

  @args.string({ description: "Domain name" })
  public domain: string

  @args.string({ description: "Model name" })
  public model: string

  @flags.boolean({ description: "Enable soft delete" })
  public softDelete: boolean

  @flags.boolean({ alias: 'uuid', description: "Enable soft delete" })
  public enableUUID: boolean

  @flags.string({ alias: 'e', description: "Set endpoint name"})
  public endpoint: string

  public static settings = {
    loadApp: false,
    stayAlive: false,
  }

  public async run() {
    if (!fs.existsSync(`app/Models/${this.domain}`)) {
      if (!fs.existsSync('app/Models')) {
        fs.mkdirSync(`app/Models`)
      }
      fs.mkdirSync(`app/Models/${this.domain}`)
    }
    if (!fs.existsSync(`app/Repositories/${this.domain}`)) {
      if (!fs.existsSync('app/Repositories')) {
        fs.mkdirSync(`app/Repositories`)
      }
      fs.mkdirSync(`app/Repositories/${this.domain}`)
    }
    if (!fs.existsSync(`app/Services/${this.domain}`)) {
      if (!fs.existsSync('app/Services')) {
        fs.mkdirSync(`app/Services`)
      }
      fs.mkdirSync(`app/Services/${this.domain}`)
    }
    if (!fs.existsSync(`app/Controllers/Http/${this.domain}`)) {
      if (!fs.existsSync('app/Controllers')) {
        fs.mkdirSync(`app/Controllers`)
        fs.mkdirSync(`app/Controllers/Http`)
      }
      fs.mkdirSync(`app/Controllers/Http/${this.domain}`)
    }
    if (!fs.existsSync(`app/Validators/${this.domain}`)) {
      if (!fs.existsSync('app/Validators')) {
        fs.mkdirSync(`app/Validators`)
      }
      fs.mkdirSync(`app/Validators/${this.domain}`)
    }
    if (!fs.existsSync(`start/routes/${this.domain.toLowerCase()}`)) {
      if (!fs.existsSync('start/routes')) {
        fs.mkdirSync(`start/routes`)
      }
      fs.mkdirSync(`start/routes/${this.domain.toLowerCase()}`)
    }

    fs.writeFileSync(`app/Models/${this.domain}/${this.model}.ts`, this.generateModel())
    this.logger.success(`${this.model} Model Created!`)
    
    fs.writeFileSync(`app/Repositories/${this.domain}/${this.model}Repository.ts`, this.generateRepository())
    this.logger.success(`${this.model} Repository Created!`)
    
    fs.writeFileSync(`app/Services/${this.domain}/${this.model}Service.ts`, this.generateService())
    this.logger.success(`${this.model} Service Created!`)
    
    fs.writeFileSync(`app/Controllers/Http/${this.domain}/${this.model}Controller.ts`, this.generateController())
    this.logger.success(`${this.model} Controller Created!`)
    
    fs.writeFileSync(`app/Validators/${this.domain}/Create${this.model}Validator.ts`, this.generateCreateValidator())
    this.logger.success(`${this.model} Create Validator Created!`)
    
    fs.writeFileSync(`app/Validators/${this.domain}/Update${this.model}Validator.ts`, this.generateUpdateValidator())
    this.logger.success(`${this.model} Update Validator Created!`)
    
    fs.writeFileSync(`start/routes/${this.domain.toLowerCase()}/${this.endpoint}.ts`, this.generateRoute())
    this.logger.success(`${this.model} Route Created!`)
  }

  generateModel() {
    return `import { DateTime } from 'luxon'
import { BaseModel${this.enableUUID ? ', beforeCreate' : ''}${this.softDelete ? ', beforeFetch, beforeFind' : ''}, column } from '@ioc:Adonis/Lucid/Orm'${this.enableUUID ? "\nimport { v4 as uuidv4, v5 as uuidv5 } from 'uuid'" : ''}

export default class ${this.model} extends BaseModel {
  ${this.softDelete ? 'public static softDelete = true\n\n  ' : ''}@column({ isPrimary: true })
  public id: string

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  ${this.softDelete ? '@column.dateTime()\n  public deleted_at: DateTime\n\n  ' : ''}static get table() {
    return "" // table name
  }${this.softDelete ? '\n\n  @beforeFind()\n  public static findWithoutSoftDeletes(query) {\n    query.whereNull("deleted_at")\n  }\n\n  @beforeFetch()\n  public static fetchWithoutSoftDeletes(query) {\n    query.whereNull("deleted_at")\n  }' : ''}${this.enableUUID ? "\n\n  @beforeCreate()\n  public static setUUID(data: " + this.model + ") {\n    const namespace = uuidv4()\n    data.id = uuidv5('" + this.model + "', namespace)\n  }" : ''}
}
`
  }

  generateRepository() {
    return `import BaseRepository from "App/Base/Repositories/BaseRepository";
import ${this.model} from "App/Models/${this.domain}/${this.model}";

export default class ${this.model}Repository extends BaseRepository {
  constructor() {
    super(${this.model})
  }
}
    `
  }

  generateService() {
    return `import BaseService from "App/Base/Services/BaseService"
import ${this.model}Repository from "App/Repositories/${this.domain}/${this.model}Repository"

export default class ${this.model}Service extends BaseService {
  constructor() {
    super(new ${this.model}Repository())
  }
}
    `
  }

  generateController() {
    return `import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ${this.model}Service from 'App/Services/${this.domain}/${this.model}Service'
import Create${this.model}Validator from 'App/Validators/${this.domain}/Create${this.model}Validator'
import Update${this.model}Validator from 'App/Validators/${this.domain}/Update${this.model}Validator'
import { ValidationException } from '@ioc:Adonis/Core/Validator'

export default class ${this.model}Controller {
  service = new ${this.model}Service()
  FETCHED_ATTRIBUTE = [
    // attribute
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
      await request.validate(Create${this.model}Validator)
      const data = request.only(this.FETCHED_ATTRIBUTE)
      const result = await this.service.store(data)
      return response.api(result, '${this.model} created!', 201)
    } catch (error) {
      if (error instanceof ValidationException) {
        const errorValidation: any = error
        return response.error(errorValidation.message, errorValidation.messages.errors, 422)
      }
      return response.error(error.message)
    }
  }

  public async show ({ params, request, response }: HttpContextContract) {
    try {
      const options = request.parseParams(request.all())
      const result = await this.service.show(params.id, options)
      if (!result) {
        return response.api(null, ${'`'+ this.model + ' with id: ${params.id} not found`'})
      }
      return response.api(result)
    } catch (error) {
      return response.error(error.message)
    }
  }

  public async update ({ params, request, response }: HttpContextContract) {
    try {
      await request.validate(Update${this.model}Validator)
      const data = request.only(this.FETCHED_ATTRIBUTE)
      const result = await this.service.update(params.id, data)
      if (!result) {
        return response.api(null, ${'`'+ this.model + ' with id: ${params.id} not found`'})
      }
      return response.api(result, '${this.model} updated!')
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
        return response.api(null, ${'`'+ this.model + ' with id: ${params.id} not found`'})
      }
      return response.api(null, '${this.model} deleted!')
    } catch (error) {
      return response.error(error.message)
    }
  }

  public async destroyAll ({ response }: HttpContextContract) {
    try {
      await this.service.deleteAll()
      return response.api(null, 'All ${this.model} deleted!')
    } catch (error) {
      return response.error(error.message)
    }
  }
}
`
  }

  generateCreateValidator() {
    return `import { schema, validator, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Create${this.model}Validator {
  constructor (protected ctx: HttpContextContract) {
  }

  public reporter = validator.reporters.api

  public schema = schema.create({
    // your validation rules
  })
}
`
  }
  
  generateUpdateValidator() {
    return `import { schema, validator, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Update${this.model}Validator {
  constructor (protected ctx: HttpContextContract) {
  }

  public reporter = validator.reporters.api

  public schema = schema.create({
    // your validation rules
  })
}
`
  }

  generateRoute() {
    return `import Route from '@ioc:Adonis/Core/Route'

Route.group(function () {
  Route.delete('/', '${this.domain}/${this.model}Controller.destroyAll').as('${this.endpoint}.destroyAll')
}).prefix('${this.endpoint}')
Route.resource('${this.endpoint}', '${this.domain}/${this.model}Controller').apiOnly()
`
  }
}
