export default class ParseParamService {
  LIKE = 'like';
  EQUAL = 'eq';
  NOT_EQUAL = 'ne';
  GREATER_THAN = 'gt';
  GREATER_THAN_EQUAL = 'gte';
  LESS_THAN = 'lt';
  LESS_THAN_EQUAL = 'lte';
  BETWEEN = 'between';

  OPERATOR_LIKE = 'ILIKE';
  OPERATOR_EQUAL = '=';
  OPERATOR_NOT_EQUAL = '!=';
  OPERATOR_GREATER_THAN = '>';
  OPERATOR_GREATER_THAN_EQUAL = '>=';
  OPERATOR_LESS_THAN = '<';
  OPERATOR_LESS_THAN_EQUAL = '<=';

  OPERATION_DEFAULT = "and";

  parse(data: { sort: any; fields: any; embed: any; search: any; page: any; limit: any; }) {
    const paginateParams = this.parsePaginateParams(data)
    const sortParams = this.parseSortParams(data.sort)
    const filterParams = this.parseFilterParams(data)
    const projectionParams = this.parseProjectionParams(data.fields)
    const relationParams = this.parseRelationParams(data.embed)
    const relationOptionParams = this.parseRelationOptionParams(data)
    const searchParams = this.parseSearch(data.search)

    const results = {
      pagination: paginateParams,
      sort: sortParams,
      filter: filterParams,
      fields: projectionParams,
      relation: relationParams,
      search: searchParams,
      relationOptions: relationOptionParams
    }

    return results
  }

  parsePaginateParams(data: { page: any; limit: any; }) {
    return {
      page: data.page ?? null,
      limit: data.limit ?? null
    }
  }

  parseSortParams(data: string) {
    if (data) {
      const sorts = data.split(',')
      const parsedSort: any[] = []

      sorts.forEach((sort: string) => {
        if (sort.includes('-')) {
          parsedSort.push({
            order: 'desc',
            attribute: sort.split('-')[1]
          })
        } else {
          parsedSort.push({
            order: 'asc',
            attribute: sort
          })
        }
      });

      return parsedSort
    }
  }

  parseFilterParams(data: { [x: string]: { [x: string]: any; }; operation?: any; }) {
    const filters: any[] = []

    Object.keys(data).forEach(key => {
      if (key != 'page' && key != 'limit' && key != 'sort' && key != 'fields' && key != 'embed' && key != 'operation' && key != 'search' && !key.includes('.')) {
        Object.keys(data[key]).forEach(k => {
          if (k == 'between') {
            const values = data[key][k].split(',')
            if (values.length != 2) {
              return
            } else {
              filters.push({
                attribute: key,
                operator: this.BETWEEN,
                value: values
              })
            }
          } else {
            if (data[key][k].includes(',')) {
              const values = data[key][k].split(',')
              values.forEach((val: any) => {
                filters.push(this.parseFilter(key, k, val))
              });
            } else {
              filters.push(this.parseFilter(key, k, data[key][k]))
            }
          }
        })
      }
    })

    return {
      operation: data.operation || 'and',
      data: filters
    }
  }

  parseProjectionParams(data: string) {
    if (data) {
      return data.split(',')
    }
  }

  parseRelationParams(data: string) {
    if (data) {
      return data.split(',')
    }
  }

  parseRelationOptionParams(data: { [x: string]: any; embed: any; }) {
    const relationOptions: any[] = []
    if (data.embed) {
      data.embed.replace(/\./g, ',').split(',').forEach((relation: string) => {
        const option: any = {}
        option.relation = relation

        if (data[`${relation}.fields`]) {
          option.fields = data[`${relation}.fields`].split(',')
        }

        if (data[`${relation}.sort`]) {
          option.sort = data[`${relation}.sort`].replace('-', '')
          option.order = data[`${relation}.sort`].includes('-') ? 'desc' : 'asc'
        }

        const filterParams = Object.keys(data).filter((key: string) => key.split('.')[0] == relation && key != `${relation}.operation` && key != `${relation}.limit` && key != `${relation}.search` && key != `${relation}.fields` && key != `${relation}.sort`).map(key => {
          const filter: any = {}
          const operator: any = Object.keys(data[key])[0]
          filter.attribute = key.split('.')[1]
          filter.operator = this.parseOperator(operator)
          filter.value = data[key][operator]
          return filter
        })

        if (filterParams.length > 0) {
          option.filter = {
            operation: data[`${relation}.operation`] || 'and',
            data: filterParams
          }
        }

        if (data[`${relation}.limit`]) {
          option.limit = data[`${relation}.limit`]
        }

        if (data[`${relation}.search`]) {
          option.search = this.parseSearch(data[`${relation}.search`])
        }

        relationOptions.push(option)
      })
    }
    return relationOptions
  }

  parseSearch(data: { [x: string]: any; }) {
    if (data) {
      const search: any = {
        data: null,
        attributes: [],
        operator: this.OPERATOR_LIKE
      }

      Object.keys(data).forEach(key => {
        search.data = `%${data[key]}%`
        search.attributes = key.split(',')
      })

      return search
    }
  }

  parseFilter(attribute: string, operator: string, value: string) {
    if (operator == this.LIKE) {
      value = `%${value}%`
    }

    return {
      attribute: attribute,
      operator: this.parseOperator(operator),
      value: value
    }
  }

  parseOperator(operator: any) {
    switch (operator) {
      case this.LIKE:
        return this.OPERATOR_LIKE
      case this.EQUAL:
        return this.OPERATOR_EQUAL
      case this.NOT_EQUAL:
        return this.OPERATOR_NOT_EQUAL
      case this.GREATER_THAN:
        return this.OPERATOR_GREATER_THAN
      case this.GREATER_THAN_EQUAL:
        return this.OPERATOR_GREATER_THAN_EQUAL
      case this.LESS_THAN:
        return this.OPERATOR_LESS_THAN
      case this.LESS_THAN_EQUAL:
        return this.OPERATOR_LESS_THAN_EQUAL
    }
  }
}
