import Route from '@ioc:Adonis/Core/Route'

Route.group(function () {
  Route.delete('/', 'Category/CategoryController.destroyAll').as('categories.destroyAll')
})
.prefix('categories')
.middleware('auth')

Route.resource('categories', 'Category/CategoryController')
    .apiOnly()
    .middleware({
      '*': 'auth',
    })
