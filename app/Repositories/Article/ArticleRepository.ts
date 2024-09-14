import Database from "@ioc:Adonis/Lucid/Database"
import BaseRepository from "App/Base/Repositories/BaseRepository"
import Article from "App/Models/Article/Article"

export default class ArticleRepository extends BaseRepository {
  constructor() {
    super(Article)
  }

  async createArticleWithCategory(data: any) {
    const trx = await Database.transaction()

    try {
      const article = await this.mainModel.create(data, { client : trx })
      if(data.categories && data.categories.length > 0) {
        const categoryId = data.categories.map((category: any) => category.id)
        await article.related('categories').attach(categoryId, trx)
      }

      await trx.commit()

      // can return with other relation
      await article.load('categories')
      await article.load('user', (query) => {
        query.select(['id', 'username'])
      })

      return article

    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  async findById(id: any, fields: any) {
    try {
      this.model = this.mainModel
      this.model = this.model.query().where(this.model.primaryKey, id)
      this.model = this.parseSelectedFields(this.model, fields)
      this.model = this.parseRelation(this.model)
      
      if (this.isSoftDelete) {
        this.model = this.model.whereNull('deleted_at')
      }

      const article = await this.model
        .preload('categories', (query) => {
          query.select(['id', 'name'])
        })
        .preload('user', (query) => {
            query.select(['id', 'username'])
        }).first()

      return article
      

    } catch (error) {
      throw error
    }
  }
}
    