import BaseRepository from "App/Base/Repositories/BaseRepository"
import Article from "App/Models/Article/Article"

export default class ArticleRepository extends BaseRepository {
  constructor() {
    super(Article)
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

      const article = await this.model.preload('user', (query) => {
        query.select(['id', 'username'])
      }).first()

      return article
      

    } catch (error) {
      throw error
    }
  }
}
    