const { db } = require('@cowellness/cw-micro-service')()

const Schema = db.logs.Schema

const newSchema = new Schema(
  {
    shortLinkId: {
      type: String,
      required: true
    },
    info: {
      type: Schema.Types.Mixed,
      required: true
    }
  },
  { timestamps: true }
)

module.exports = db.logs.model('logs', newSchema)
