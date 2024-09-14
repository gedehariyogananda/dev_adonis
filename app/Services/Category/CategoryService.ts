import BaseService from "App/Base/Services/BaseService"
import CategoryRepository from "App/Repositories/Category/CategoryRepository"

export default class CategoryService extends BaseService {
  constructor() {
    super(new CategoryRepository())
  }
}
    