import BaseService from "App/Base/Services/BaseService"
import DefaultException from "App/Exceptions/DefaultException"
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

  async updateComment(authId: any, commentId:any ,data: any){
    try {
      const comment = await this.repository.find(commentId)
      
      if (!comment) {
        throw new DefaultException('Data not found', 404)
      }

      if (comment.user_id !== authId) {
        throw new DefaultException('You are not authorized to update this data', 403)
      }

      data = {
        ...data,
        user_id: authId
      }

      return await this.repository.update(commentId, data)

    } catch (error) {
      throw error
    }
  }
}
    