const { db } = require('@cowellness/cw-micro-service')()
const { customAlphabet } = require('nanoid')

const Schema = db.links.Schema
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 7)

const newSchema = new Schema(
  {
    key: {
      type: String,
      default: () => nanoid(7),
      index: { unique: true }
    },
    link: {
      type: String,
      required: true
    },
    click: {
      type: Number,
      default: 0
    },
    validTill: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
)

module.exports = db.links.model('links', newSchema)
