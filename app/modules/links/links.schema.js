
const queueGet = {
  type: 'object',
  required: ['key'],
  properties: {
    key: {
      type: 'string'
    }
  },
  additionalProperties: false
}

const queuePost = {
  type: 'object',
  required: ['url', 'expiryDays'],
  properties: {
    url: {
      type: 'string'
    },
    expiryDays: {
      type: 'number',
      minimum: 0
    }
  },
  additionalProperties: false
}

module.exports = {
  queueGet,
  queuePost
}
