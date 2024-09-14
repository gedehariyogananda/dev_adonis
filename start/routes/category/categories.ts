import Route from '@ioc:Adonis/Core/Route'

Route.resource('categories', 'Category/CategoryController')
    .apiOnly()
    .except(['show'])
    .middleware({
      '*': 'auth',
    })
