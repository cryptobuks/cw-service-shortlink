const { ctr } = require('@cowellness/cw-micro-service')()
const isBot = require('isbot-fast')

function harvestRequest (request) {
  return {
    ip: request.ip,
    agent: request.headers['user-agent']
  }
}

module.exports = async function (fastify, opts, done) {
  fastify.get('/:id', function (request, reply) {
    const ua = request.headers['user-agent'] || ''
    ctr.links.findFullUrl(request.params.id, isBot(ua), harvestRequest(request)).then((resp) => {
      reply.redirect(resp.url)
    }).catch(() => {
      reply.code(410).cwsendFail({
        message: 'URL not found or expired',
        _message: ''
      })
    })
  })
}
