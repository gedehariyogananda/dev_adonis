import { driveConfig } from '@adonisjs/core/build/config'
import Application from '@ioc:Adonis/Core/Application'
import Env from '@ioc:Adonis/Core/Env'

export default driveConfig({
  disk: Env.get('SET_DRIVE_DISK'),

  disks: {
    local: {
      driver: 'local',
      visibility: 'public',
      root: Application.publicPath(Env.get('BASE_PATH_LOCAL')),
      basePath: '/' + Env.get('BASE_PATH_LOCAL'),
      serveFiles: true,
    },

    // s3 setups

    // s3: {
    //   driver: 's3',
    //   visibility: 'public',
    //   key: Env.get('S3_KEY'),
    //   secret: Env.get('S3_SECRET'),
    //   region: Env.get('S3_REGION'),
    //   bucket: Env.get('S3_BUCKET'),
    //   endpoint: Env.get('S3_ENDPOINT'),
      
    //   // For minio to work
    //   // forcePathStyle: true,
    // },
  },
})
