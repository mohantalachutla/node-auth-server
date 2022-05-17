//others
const dotenvconfig = require("dotenv").config()
const dotenv_expand = require("dotenv-expand")
dotenv_expand(dotenvconfig)
const express = require("express")
const cors = require("cors")
// const bodyParser = require('body-parser')
const eformidable = require("express-formidable")
const esession = require("express-session")
const morgan = require("morgan")

// core
const process = require("process")

//local
const { authRouter } = require("./src/controller/auth.controller")
const { testRouter } = require("./src/controller/test.controller")
const { db } = require("./src/config/mongoose.config")
const { RequiredError, EnvNotSetError } = require("./src/error/common.error")
const { SystemError } = require("./src/error/base.error")

const app = express()

corsOptions = {
  origin: ["http://localhost:8080", "http://localhost:3000"],
  credentials: true,
  optionsSuccessStatus: 200,
}

//middilewares
app.use(cors(corsOptions))
app.use(morgan("dev"))
// app.use(bodyParser())
app.use(
  eformidable({
    encoding: "utf-8",
    multiples: true,
  })
)
app.use(
  esession({ resave: false, saveUninitialized: true, secret: "itsasecret" })
)

// routes
app.get("/", function (req, res) {
  res.status(201).send("A  auth server")
})

app.use((req, res, next) => {
  const { fields, files, query, session, headers } = req
  console.debug(">>>>>>>>>>>>>> New request <<<<<<<<<<")
  console.debug({ fields, files, query, session, headers })
  next()
})

app.use("/test", testRouter)
app.use("/auth", authRouter)

//environment variables

if (
  !(
    process.env.HOST &&
    process.env.PORT &&
    process.env.MONGO_DB_URL
  )
)
  throw new EnvNotSetError()

const PORT = process.env.PORT
const MONGO_DB_URL = process.env.MONGO_DB_URL

let notATopLevleAwait = async () => {
  const session = await db(MONGO_DB_URL)

  if (!session)
    throw new SystemError("DBSessionError", 500, "Db session not created")

  // all set; start server
  app.listen(PORT, function () {
    console.info(`Crypto server running at port : ${PORT}`)
  })
}
notATopLevleAwait()
