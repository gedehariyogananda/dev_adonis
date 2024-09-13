/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'
import fs from 'fs';

Route.group(function () {
  if (fs.existsSync(`${__dirname}/routes`)) {
    const folders = fs.readdirSync(`${__dirname}/routes`)
    folders.map((folder) => {
      if (folder != 'auth') {
        const files = fs.readdirSync(`${__dirname}/routes/${folder}`)
        files.map((file) => {
          if (!file.includes('.map')) {
            require(`${__dirname}/routes/${folder}/${file}`)
          }
        })
      }
    })
  }
}).prefix('api')

Route.group(function () {
  if (fs.existsSync(`${__dirname}/routes/auth`)) {
    const files = fs.readdirSync(`${__dirname}/routes/auth`)
    files.map((file) => {
      if (!file.includes('.map')) {
        require(`${__dirname}/routes/auth/${file}`)
      }
    })
  }
}).prefix('auth')

Route.get('/', async ({ view }) => {
  return view.render('welcome')
})

Route.get('/api', async ({ response }) => {
  return response.api(null, 'It works!')
})

Route.on('*').render('index')
