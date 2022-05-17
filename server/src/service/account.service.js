const { RequiredError } = require("../error/common.error")
const { AccountNotFoundError } = require("../error/account.error")
const { Account } = require("../model/account.model")
const mongoose = require("mongoose")
const { Query, Document, Schema } = mongoose
const { ObjectId } = require("mongodb")
const _ = require("lodash")

// keep password separate
/**
 *
 * @param {cryptoAddress: Crypto Address}
 * @param {_id: Account ID}
 * @returns accountDocument
 */
let findAccountDetails = async ({
  cryptoAddress,
  firstName,
  lastName,
  displayName,
  displayPicture,
  ssn,
  createdAt,
  updatedAt,
}) => {
  let account = await findAccount({
    cryptoAddress,
    firstName,
    lastName,
    displayName,
    displayPicture,
    ssn,
    createdAt,
    updatedAt,
  })
  return account
}

/**
 *
 * @param {_id: Account ID}
 * @returns accountDocument
 */
let findAccountDetailsById = async (_id, projection) => {
  let account = await findAccountById(_id, projection)
  return account
}

/**
 *
 * @param {cryptoAddress: Crypto Address}
 * @param {_id: Account ID}
 * @returns accountDocument
 */
let findAccount = async (
  {
    email,
    cryptoAddress,
    status = "active",
    firstName,
    lastName,
    displayName,
    displayPicture,
    ssn,
    createdAt,
    updatedAt,
  },
  projection = {}
) => {
  let account = {}
  let where = {}
  // mongoose.set("debug", true)
  where = _.chain({
    email,
    cryptoAddress,
    status,
    firstName,
    lastName,
    displayName,
    displayPicture,
    ssn,
    createdAt,
    updatedAt,
  })
    .omitBy(_.isUndefined)
    .value()
  if (where !== {})
    account = await Account.findOne(where, projection).lean().exec()
  if (!(account && account !== {})) throw new AccountNotFoundError()
  return account
}

/**
 *
 * @param email
 * @param cryptoAddress
 * @param status
 * @param firstName
 * @param lastName
 * @param displayName
 * @param ssn
 * @param createdAt
 * @param updatedAt
 * @returns All the account related details
 * @description populates activities
 */
let findAccountAndPopulate = async (
  {
    email,
    cryptoAddress,
    status = "active",
    firstName,
    lastName,
    displayName,
    displayPicture,
    ssn,
    createdAt,
    updatedAt,
  },
  projection = {}
) => {
  let account = {}
  let where = {}
  // mongoose.set("debug", true)
  where = _.chain({
    email,
    cryptoAddress,
    status,
    firstName,
    lastName,
    displayName,
    displayPicture,
    ssn,
    createdAt,
    updatedAt,
  })
    .omitBy(_.isUndefined)
    .value()
  if (where !== {})
    account = await Account.findOne(where, projection)
      .populate("activities")
      .lean()
      .exec()
  if (!(account && account !== {})) throw new AccountNotFoundError()
  return account
}

/**
 * @requires email, password, cryptoaddress
 * @param email, password, cryptoAddress, firstName, lastName, displayName, displayPicture, ssn, createdAt, updatedAt
 * @returns account
 * @description creates an new account
 */
const createAccount = async ({
  email,
  password,
  cryptoAddress,
  firstName,
  lastName,
  displayName,
  displayPicture,
  ssn,
  createdAt,
  updatedAt,
}) => {
  const account = new Account(
    _.chain({
      email,
      password,
      cryptoAddress,
      firstName,
      lastName,
      displayName,
      displayPicture,
      ssn,
      createdAt,
      updatedAt
    })
      .omitBy(_.isUndefined)
      .value()
  )
  return await account.save()
}

/**
 *
 * @param _id account id
 * @param projection
 * @returns  account
 */
const findAccountById = async (_id, projection = {}) => {
  let account = {}
  if (_id) account = await Account.findById(_id, projection).lean().exec()
  return account
}

exports.createAccount = createAccount
exports.findAccount = findAccount
exports.findAccountById = findAccountById
exports.findAccountDetails = findAccountDetails
exports.findAccountDetailsById = findAccountDetailsById
exports.findAccountAndPopulate = findAccountAndPopulate
