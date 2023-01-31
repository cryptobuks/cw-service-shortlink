const path = require('path')
const basepath = path.join(__dirname, '..', 'app')

module.exports = {
  service: 'shortlink',
  fastify: { active: true, port: 3010, prefix: '' },
  rabbitmq: { active: true, server: 'localhost:15672', user: 'dev', password: 'dev123' },
  redis: { active: false, server: 'localhost', port: 16379 },
  swagger: { active: true, exposeRoute: true },
  logger: { level: 'debug' },
  basepath,
  options: {
    url: 'https://cwl.fit/'
  },
  mongodb: {
    active: true,
    server: 'localhost',
    port: '',
    user: '',
    password: '',
    debug: true,
    databases: [
      {
        name: 'links',
        db: 'shortlink',
        options: {}
      },
      {
        name: 'logs',
        db: 'shortlink',
        options: {}
      }
    ]
  }
}
