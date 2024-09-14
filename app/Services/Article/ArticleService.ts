import BaseService from "App/Base/Services/BaseService"
import DefaultException from "App/Exceptions/DefaultException"
import ArticleRepository from "App/Repositories/Article/ArticleRepository"

export default class ArticleService extends BaseService {
  constructor() {
    super(new ArticleRepository())
  }

  async spesifyArticleUser(id: any, options : any = {}) {
    try {
      this.repository.setRelation(options.relation)
      this.repository.setRelationOptions(options.relationOptions)
      
      const article = await this.repository.findById(id, options.fields)
      if (!article) {
        throw new DefaultException('Data not found', 404)
      }

      return article

    } catch (error) {
      throw error
    }

  }

  async addedArticles(authId : any,data: any) {
    try {
      data = {
        ...data,
        user_id : authId,
      }

      return await this.repository.storeArticle(data)

    } catch (error) {
      throw error
    }
  }

  async updateArticle(authId : any, id: any, data: any) {
    try {
      const article = await this.repository.find(id)

      if (!article) {
        throw new DefaultException('Data not found', 404)
      }

      if (article.user_id !== authId) {
        // forbidden throws
        throw new DefaultException('You are not authorized to update this data', 403)
      }

      data = {
        ...data,
        user_id : authId,
      }

      return await this.repository.update(id, data)

    } catch (error) {
      throw error
    }
  }

  async deleteArticle(authId : any, id: any) {
    try {
      const article = await this.repository.find(id)

      if (!article) {
        throw new DefaultException('Data not found', 404)
      }

      if (article.user_id !== authId) {
        // forbidden throws
        throw new DefaultException('You are not authorized to delete this data', 403)
      }

      return await this.repository.delete(id)

    } catch (error) {
      throw error
    }
  }
}
    