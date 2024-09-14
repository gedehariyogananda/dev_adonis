import Route from '@ioc:Adonis/Core/Route'

Route.resource('comments', 'Comment/CommentController')
  .middleware({ '*': 'auth' })
  .except(['index', 'show'])
  .apiOnly()
