export default class BaseService {
  repository: any

  constructor(repository: any) {
    this.repository = repository
  }

  async getAll(options: any) {
    try {
      this.repository.setRelation(options.relation)
      this.repository.setRelationOptions(options.relationOptions)
      const results = await this.repository.getAll(options.pagination, options.sort, options.filter, options.fields, options.search)
      return results
    } catch (error) {
      throw error
    }
  }

  async store(data: any) {
    try {
      return await this.repository.store(data)
    } catch (error) {
      throw error
    }
  }

  async show(id: any, options: any = {}) {
    try {
      this.repository.setRelation(options.relation)
      this.repository.setRelationOptions(options.relationOptions)
      return await this.repository.show(id, options.fields)
    } catch (error) {
      throw error
    }
  }

  async find(id: any) {
    try {
      return await this.repository.find(id)
    } catch (error) {
      throw error
    }
  }

  async first() {
    try {
      return await this.repository.first()
    } catch (error) {
      throw error
    }
  }

  async update(id: any, data: any) {
    try {
      return await this.repository.update(id, data)
    } catch (error) {
      throw error
    }
  }

  async delete(id: any) {
    try {
      return await this.repository.delete(id)
    } catch (error) {
      throw error
    }
  }

  async deleteAll() {
    try {
      return await this.repository.deleteAll()
    } catch (error) {
      throw error
    }
  }

  async getDeletedAll(options: any) {
    try {
      this.repository.setRelation(options.relation)
      const results = await this.repository.getDeletedAll(options.pagination, options.sort, options.filter, options.fields, options.search)
      return results
    } catch (error) {
      throw error
    }
  }

  async showDeleted(id: any, options: any = {}) {
    try {
      this.repository.setRelation(options.relation)
      return await this.repository.showDeleted(id, options.fields)
    } catch (error) {
      throw error
    }
  }

  async restore(id: any) {
    try {
      return await this.repository.restore(id)
    } catch (error) {
      throw error
    }
  }

  async restoreAll() {
    try {
      return await this.repository.restoreAll()
    } catch (error) {
      throw error
    }
  }

  async permanentDelete(id: any) {
    try {
      return await this.repository.permanentDelete(id)
    } catch (error) {
      throw error
    }
  }

  async permanentDeleteAll() {
    try {
      return await this.repository.permanentDeleteAll()
    } catch (error) {
      throw error
    }
  }
}
