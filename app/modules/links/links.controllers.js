const { db, ctr } = require('@cowellness/cw-micro-service')()

/**
 * @class LinksController
 * @classdesc Controller Links
 */
class LinksController {
  constructor () {
    this.links = db.links.model('links')
  }

  findIncremental (key) {
    return this.links.findOneAndUpdate({ key: key, validTill: { $gte: Date.now() } }, { $inc: { click: 1 } }, { new: true }).exec()
  }

  find (key) {
    return this.links.findOne({ key: key })
  }

  findWithExpiry (key) {
    return this.links.findOne({ key: key, validTill: { $gte: Date.now() } }).exec()
  }

  findFullUrl (key, isBot, requestInfo) {
    const p = new Promise((resolve, reject) => {
      let query
      if (isBot) {
        query = this.findWithExpiry(key)
      } else {
        query = this.findIncremental(key)
      }
      query.then((url) => {
        if (url) {
          if (isBot) {
            resolve({ url: url.link })
          } else {
            ctr.logs.createLog(key, requestInfo).then((resp) => {
              resolve({ url: url.link })
            })
          }
        } else {
          reject(new Error('Not found'))
        }
      })
    })
    return p
  }

  createLink (url, duration) {
    const p = new Promise((resolve, reject) => {
      this.links.findOne({ link: url }, (err, link) => {
        if (err) {
          reject(err)
        }
        const dt = new Date(Date.now())
        dt.setDate(dt.getDate() + duration)
        if (link) {
          link.validTill = dt
          link.save((err, l) => {
            if (err) {
              reject(err)
            }
            resolve(l)
          })
        } else {
          this.links.create({
            link: url,
            validTill: dt
          }).then((l) => {
            resolve(l)
          })
        }
      })
    })
    return p
  }
}

module.exports = LinksController
