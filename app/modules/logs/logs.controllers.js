const { db } = require('@cowellness/cw-micro-service')()

class LogsController {
  constructor () {
    this.logs = db.logs.model('logs')
  }

  createLog (shortLinkId, info) {
    return this.logs.create({
      shortLinkId: shortLinkId,
      info: info
    })
  }
}

module.exports = LogsController
