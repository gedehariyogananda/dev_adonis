import Route from '@ioc:Adonis/Core/Route'

Route.group(function () {
  Route.delete('/', 'Article/ArticleController.destroyAll').as('articles.destroyAll')
}).prefix('articles')
Route.resource('articles', 'Article/ArticleController')
    .apiOnly()
    .middleware({
      '*': 'auth',
    })
