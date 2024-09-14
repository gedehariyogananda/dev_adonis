import BaseRepository from "App/Base/Repositories/BaseRepository";
import Comment from "App/Models/Comment/Comment";

export default class CommentRepository extends BaseRepository {
  constructor() {
    super(Comment)
  }
}
    