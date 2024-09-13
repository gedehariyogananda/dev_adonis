import { DateTime } from "luxon"

export default class BaseRepository {
  protected model: any
  protected mainModel: any
  protected isSoftDelete: boolean
  protected RELATIONS: string[]
  protected RELATION_OPTIONS: any

  constructor(model: any) {
    this.model = model
    this.mainModel = model
    this.isSoftDelete = model.softDelete
  }

  async getAll(pagination: any, sort: any, whereClauses: any, fields: any, search: any) {
    try {
      this.model = this.mainModel
      this.model = this.model.query()
      this.model = this.parseSelectedFields(this.model, fields)
      this.model = this.parseWhere(this.model, whereClauses)
      this.model = this.parseSearch(this.model, whereClauses, search)
      this.model = this.parseRelation(this.model)
      this.model = this.parseSort(this.model, sort)
      if (pagination.page && pagination.limit) {
        if (this.isSoftDelete) {
          return await this.model.whereNull('deleted_at').paginate(pagination.page, pagination.limit)
        }
        return await this.model.paginate(pagination.page, pagination.limit)
      } else {
        if (this.isSoftDelete) {
          return await this.model.whereNull('deleted_at')
        }
        return await this.model
      }
    } catch (error) {
      throw error
    }
  }

  async get(data: any = {}) {
    try {
      this.model = this.mainModel
      this.model = this.model.query()
      if (this.isSoftDelete) {
        this.model = this.model.whereNull('deleted_at')
      }
      if (data.sort) {
        this.model = this.parseSort(this.model, data.sort)
      }
      return await this.model
    } catch (error) {
      throw error
    }
  }

  async store(data: any) {
    try {
      this.model = this.mainModel
      return await this.model.create(data)
    } catch (error) {
      throw error
    }
  }

  async multiInsert(data: any[]) {
    try {
      this.model = this.mainModel
      return await this.model.createMany(data)
    } catch (error) {
      throw error
    }
  }

  async show(id: any, fields: any) {
    try {
      this.model = this.mainModel
      this.model = this.model.query().where(this.model.primaryKey, id)
      this.model = this.parseSelectedFields(this.model, fields)
      this.model = this.parseRelation(this.model)
      if (this.isSoftDelete) {
        this.model = this.model.whereNull('deleted_at')
      }
      return await this.model.first()
    } catch (error) {
      throw error
    }
  }

  async update(id: any, data: any) {
    try {
      this.model = this.mainModel
      if (! await this.model.find(id)) {
        return null
      }
      data.updated_at = DateTime.now()
      if (Object.keys(data).length) {
        await this.model.query().where(this.model.primaryKey, id).update(data)
      }
      return await this.model.find(id)
    } catch (error) {
      throw error
    }
  }

  async delete(id: any) {
    try {
      this.model = this.mainModel
      const result = await this.model.find(id)
      if (this.isSoftDelete) {
        await this.model.query().where(this.model.primaryKey, id).update({ deleted_at: DateTime.local() })
      } else {
        await this.model.query().where(this.model.primaryKey, id).delete()
      }
      return result
    } catch (error) {
      throw error
    }
  }

  async deleteAll() {
    try {
      this.model = this.mainModel
      if (this.isSoftDelete) {
        return await this.model.query().whereNull('deleted_at').update({ deleted_at: DateTime.local() })
      } else {
        return await this.model.query().delete()
      }
    } catch (error) {
      throw error
    }
  }

  async first() {
    try {
      this.model = this.mainModel
      this.model = this.model.query()
      if (this.isSoftDelete) {
        this.model = this.model.whereNull('deleted_at')
      }
      return await this.model.first()
    } catch (error) {
      throw error
    }
  }

  async find(id: any) {
    try {
      this.model = this.mainModel
      this.model = this.model.query().where(this.model.primaryKey, id)
      if (this.isSoftDelete) {
        this.model = this.model.whereNull('deleted_at')
      }
      return await this.model.first()
    } catch (error) {
      throw error
    }
  }

  setRelation(relation: string[]) {
    this.RELATIONS = relation
  }

  setRelationOptions(relationOptions: any) {
    this.RELATION_OPTIONS = relationOptions
  }

  parseSelectedFields(model: any, fields: any) {
    if (fields) {
      model = model.select(fields)
    }
    return model
  }

  parseWhere(model: any, whereClauses: any) {
    if (whereClauses.data) {
      if (whereClauses.operation == 'and') {
        whereClauses.data.forEach((whereClause: any) => {
          if (whereClause.operator == 'between') {
            model = model.whereBetween(whereClause.attribute, whereClause.value)
          } else {
            if (whereClause.value == 'null') {
              model = model.whereNull(whereClause.attribute)
            } else {
              if (whereClause.attribute.includes('.')) {
                const attr = whereClause.attribute.split('.')
                model = model.whereHas(attr[0], (builder: any) => {
                  builder.where(attr[1], whereClause.operator, whereClause.value)
                })
              } else {
                model = model.where(whereClause.attribute, whereClause.operator, whereClause.value)
              }
            }
          }
        });
      } else {
        whereClauses.data.forEach((whereClause: any, index: number) => {
          if (whereClause.operator == 'between') {
            model = model.whereBetween(whereClause.attribute, whereClause.value)
          } else {
            if (index == 0) {
              if (whereClause.value == 'null') {
                model = model.whereNull(whereClause.attribute)
              } else {
                if (whereClause.attribute.includes('.')) {
                  const attr = whereClause.attribute.split('.')
                  model = model.whereHas(attr[0], (builder: any) => {
                    builder.where(attr[1], whereClause.operator, whereClause.value)
                  })
                } else {
                  model = model.where(whereClause.attribute, whereClause.operator, whereClause.value)
                }
              }
            } else {
              if (whereClause.value == 'null') {
                model = model.orWhereNull(whereClause.attribute)
              } else {
                if (whereClause.attribute.includes('.')) {
                  const attr = whereClause.attribute.split('.')
                  model = model.orWhereHas(attr[0], (builder: any) => {
                    builder.where(attr[1], whereClause.operator, whereClause.value)
                  })
                } else {
                  model = model.orWhere(whereClause.attribute, whereClause.operator, whereClause.value)
                }
              }
            }
          }
        });
      }
    }
    return model
  }

  parseRelation(model: any) {
    if (this.RELATIONS) {
      this.RELATIONS.forEach((relation) => {
        if (relation.split('.').length > 1) {
          const firstRelation = relation.substr(0, relation.indexOf('.'))
          model = model.preload(firstRelation, (query) => {
            if (this.RELATION_OPTIONS) {
              let relationOption = this.RELATION_OPTIONS.find((item: any) => { return item.relation == firstRelation })
              this.parseRelationOption(query, relationOption)
            }
            this.parseNestedRelation(query, relation.substr(relation.indexOf('.') + 1), firstRelation)
          })
        } else {
          model = model.preload(relation, (query) => {
            if (this.RELATION_OPTIONS) {
              let relationOption = this.RELATION_OPTIONS.find((item: any) => { return item.relation == relation })
              this.parseRelationOption(query, relationOption)
            }
          })
        }
      })
    }
    return model
  }

  parseNestedRelation(query: any, relation: string, firstRelation: string) {
    let relations = this.RELATIONS.filter(d => { return typeof d == 'string' })
    relations = relations.filter(d => { return d.includes(firstRelation + '.') })
    if (relations.length > 1) {
      relations.map(data => {
        this.parseNestedRelation(query, data.substr(data.indexOf('.') + 1), relation.substr(0, data.indexOf('.')))
      })
    } else {
      if (relation.indexOf('.') > 0) {
        let subRelation = relation.substr(0, relation.indexOf('.'))
        query.preload(subRelation, (subQuery) => {
          if (this.RELATION_OPTIONS) {
            let relationOption = this.RELATION_OPTIONS.find((item: any) => { return item.relation == subRelation })
            this.parseRelationOption(subQuery, relationOption)
          }
          this.parseNestedRelation(subQuery, relation.substr(relation.indexOf('.') + 1), subRelation)
        })
      } else {
        query.preload(relation, (subQuery) => {
          if (this.RELATION_OPTIONS) {
            let relationOption = this.RELATION_OPTIONS.find((item: any) => { return item.relation == relation })
            this.parseRelationOption(subQuery, relationOption)
          }
        })
      }
    }
  }

  parseRelationOption(query: any, relationOption: any) {
    if (relationOption) {
      if (relationOption.fields) {
        query = query.select(relationOption.fields)
      }
      if (relationOption.sort) {
        query = query.orderBy(relationOption.sort, relationOption.order)
      }
      if (relationOption.filter) {
        query = this.parseWhere(query, relationOption.filter)
      }
      if (relationOption.limit) {
        query = query.limit(relationOption.limit)
      }
      if (relationOption.search) {
        relationOption.filter = relationOption.filter || { operation: 'and', data: [] }
        query = this.parseSearch(query, relationOption.filter, relationOption.search)
      }
    }
    return query
  }

  parseSort(model: any, sort: any[]) {
    if (sort) {
      sort.forEach((sort: any) => {
        model = model.orderBy(sort.attribute, sort.order)
      });
    }
    return model
  }

  parseSearch(model: any, whereClauses: any, search: any) {
    if (search) {
      const data = search.data
      const attributes = search.attributes
      const operator = search.operator
      if (attributes) {
        model = model.where((query) => {          
          if (whereClauses.data.length > 0) {
            attributes.forEach((attribute: string) => {
              if (attribute.includes('.')) {
                const attr = attribute.split('.')
                const field = attr[attr.length - 1]
                const relations = attr.slice(0, attr.length - 1)
                query.whereHas(relations[0], (query: any) => {
                  this.parseNestedSearch(query, relations.slice(1), field, data, operator)
                })
              } else {
                query.orWhere(attribute, operator, data)
              }
            });
          } else {
            attributes.forEach((attribute: any, index: number) => {
              if (index == 0) {
                if (attribute.includes('.')) {
                  const attr = attribute.split('.')
                  const field = attr[attr.length - 1]
                  const relations = attr.slice(0, attr.length - 1)
                  query.whereHas(relations[0], (query: any) => {
                    this.parseNestedSearch(query, relations.slice(1), field, data, operator)
                  })
                } else {
                  query.where(attribute, operator, data)
                }
              } else {
                if (attribute.includes('.')) {
                  const attr = attribute.split('.')
                  const field = attr[attr.length - 1]
                  const relations = attr.slice(0, attr.length - 1)
                  query.orWhereHas(relations[0], (query: any) => {
                    this.parseNestedSearch(query, relations.slice(1), field, data, operator)
                  })
                } else {
                  query.orWhere(attribute, operator, data)
                }
              }
            });
          }
        })
      }
    }
    return model
  }

  parseNestedSearch(model: any, relations: any, field: any, value: any, operator: any = 'ilike') {
    if (relations.length > 0) {
      model = model.whereHas(relations[0], (query: any) => {
        this.parseNestedSearch(query, relations.slice(1), field, value)
      })
    } else {
      model = model.where(field, operator, value)
    }
    return model
  }
}
