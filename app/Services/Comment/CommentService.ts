import BaseService from "App/Base/Services/BaseService"
import CommentRepository from "App/Repositories/Comment/CommentRepository"

export default class CommentService extends BaseService {
  constructor() {
    super(new CommentRepository())
  }

  async storeComment(authId: any,data: any) {
    try {
      data = {
        ...data,
        user_id: authId
      }

      return await this.repository.store(data)
      
    } catch (error) {
      throw error
    }
  }
}
    