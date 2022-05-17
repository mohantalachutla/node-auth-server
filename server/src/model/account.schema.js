const { Schema } = require("mongoose")
const { ObjectId, Buffer } = Schema.Types

/**
 * _id === account._id
 */
let accountSchema = Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  cryptoAddress: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    default: "active",
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  displayName: {
    type: String,
  },
  displayPicture: {
    type: Buffer,
  },
  ssn: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
})

exports.accountSchema = accountSchema
