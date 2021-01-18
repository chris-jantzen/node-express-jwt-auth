const User = require('../models/User')
const jwt = require('jsonwebtoken')

// handle errors
const handleErrors = (err) => {
  let errors = { email: '', password: '' }
  console.log(err.message, err.code)

  if (err.code === 11000) {
    errors['email'] = 'that email is already registered'
    return errors
  }

  // incorrect email
  if (!(err.message.includes('is not registered') !== -1)) {
    errors.email = err.message
  }

  // incorrect password
  if (err.message === 'Incorrect password') {
    errors.password = 'Password is incorrect'
  }

  // Validation errors
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message
    })
  }
  return errors
}

const maxAge = 3 * 60 * 60 * 24
const createToken = (id) => {
  return jwt.sign({ id }, 'chris secret key', {
    expiresIn: maxAge
  })
}

const signup_get = (req, res) => {
  res.render('signup')
}

const login_get = (req, res) => {
  res.render('login')
}

const signup_post = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.create({ email, password })
    const token = createToken(user._id)
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    res.status(201).json({
      status: true,
      user
    })
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err)
    res.status(400).json({
      success: false,
      errors
    })
  }
}

const login_post = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.login(email, password)
    const token = createToken(user._id)
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    res.status(200).json({
      success: true,
      user: user._id
    })
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({
      success: false,
      errors
    })
  }
}

module.exports = {
  signup_get,
  signup_post,
  login_get,
  login_post
}
