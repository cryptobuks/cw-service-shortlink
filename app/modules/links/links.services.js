const { ctr, rabbitmq } = require('@cowellness/cw-micro-service')()
const validationSchema = require('./links.schema')
const config = require('config')

rabbitmq.consume('/shortlinks/get', (msg) => {
  const p = new Promise((resolve, reject) => {
    const message = msg.data
    const hasErrors = rabbitmq.validate(validationSchema.queueGet, message)
    if (hasErrors) {
      resolve({ errors: hasErrors, result: 'failed' })
      return
    }
    ctr.links.find(message.key).then((resp) => {
      resolve({ result: 'ok', data: resp })
    })
  })
  return p
})

rabbitmq.consume('/shortlinks/post', (msg) => {
  const p = new Promise((resolve, reject) => {
    const message = msg.data
    if (!message.expiryDays) message.expiryDays = 3650
    const hasErrors = rabbitmq.validate(validationSchema.queuePost, message)
    if (hasErrors) {
      resolve({ errors: hasErrors, result: 'failed' })
      return
    }
    ctr.links.createLink(message.url, parseInt(message.expiryDays)).then((resp) => {
      if (!resp) {
        resolve({ result: 'failed', data: undefined })
      } else {
        resolve({ result: 'ok', data: resp, shortURL: config.options.url + resp.key })
      }
    })
  })
  return p
})
