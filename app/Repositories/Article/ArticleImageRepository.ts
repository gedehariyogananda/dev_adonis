import BaseRepository from "App/Base/Repositories/BaseRepository";
import ArticleImage from "App/Models/Article/ArticleImage";

export default class ArticleImageRepository extends BaseRepository {
  constructor() {
    super(ArticleImage)
  }

  async storeArticleImage(articleId: any, img: any) {
    try {
        const storeImg = await this.model.create({
            article_id: articleId,
            article_img: img
        })

        return storeImg
    } catch (error) {
      throw error
    }
  }

  async findImageByArticleId(articleId: any) {
    try {
      const articleImages = await this.model.query().where('article_id', articleId)
      return articleImages
    } catch (error) {
      throw error
    }
  }
}
    