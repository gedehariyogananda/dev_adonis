import BaseRepository from "App/Base/Repositories/BaseRepository";
import Category from "App/Models/Category/Category";

export default class CategoryRepository extends BaseRepository {
  constructor() {
    super(Category)
  }
}
    