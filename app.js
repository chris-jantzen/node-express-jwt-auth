const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const { requireAuth, checkUser } = require('./middleware/authMiddleware')

const { authRouter } = require('./routes/authRoutes')

const app = express()

// middleware
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

// view engine
app.set('view engine', 'ejs')

// database connection
const dbURI = 'mongodb://localhost/smoothiesApp'
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err))

// routes
app.get('*', checkUser)
app.get('/', /* requireAuth, */ (_, res) => res.render('home'))
app.get('/smoothies', requireAuth, (_, res) => res.render('smoothies'))
app.use(authRouter)

// cookies
// app.get('/set-cookies', (req, res) => {
//   res.cookie('newUser', false)
//   res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 60 * 24, secure: false })
//   res.send('you got the cookie')
// })

// app.get('/read-cookies', (req, res) => {
//   const cookies = req.cookies
//   console.log(cookies);

//   res.json(cookies)
// })
