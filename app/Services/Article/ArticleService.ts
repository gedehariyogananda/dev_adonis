import BaseService from "App/Base/Services/BaseService"
import DefaultException from "App/Exceptions/DefaultException"
import ArticleImageRepository from "App/Repositories/Article/ArticleImageRepository"
import ArticleRepository from "App/Repositories/Article/ArticleRepository"
import Env from '@ioc:Adonis/Core/Env'
import { generateHashNameFile } from "App/Utils/HashFileNameUtil"

export default class ArticleService extends BaseService {

  articleImageRepository: ArticleImageRepository

  constructor() {
    super(new ArticleRepository())
    this.articleImageRepository = new ArticleImageRepository()
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

  async addedArticles(authId : any,data: any, articlesImg: any) {
    try {
      data = {
        ...data,
        user_id : authId,
      }

      const storeArticle = await this.repository.storeArticle(data)

      if (storeArticle) {
        if (articlesImg && articlesImg.length > 0) {
          const articleId = storeArticle.id

          await Promise.all(
            articlesImg.map(async (img: any) => {
              const pathInit = 'articles'
              const hashedFileName = generateHashNameFile(img.extname)
               
              // saved to disk local to accessbility public path
              await img.moveToDisk(pathInit, {
                name: hashedFileName,
                overwrite: true,
              }, 'local');
          
              const path = Env.get('BASE_PATH_LOCAL') + '/' + pathInit + '/' + hashedFileName

              await this.articleImageRepository.storeArticleImage(articleId, path)
            })
          )
        }

        return storeArticle
      }

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
    