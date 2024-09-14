import Route from '@ioc:Adonis/Core/Route'

Route.group(function () {
  Route.delete('/', 'Comment/CommentController.destroyAll').as('comments.destroyAll')
}).prefix('comments')
Route.resource('comments', 'Comment/CommentController')
  .middleware({ '*': 'auth' })
  .except(['index', 'show'])
  .apiOnly()
