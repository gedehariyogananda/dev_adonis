import Route from '@ioc:Adonis/Core/Route'

Route.resource('articles', 'Article/ArticleController')
    .apiOnly()
    .middleware({
      '*': 'auth',
    })
