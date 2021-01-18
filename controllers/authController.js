const User = require('../models/User')

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code)
  let errors = {}

  if (err.code === 11000) {
    errors['email'] = 'that email is already registered'
    return errors
  }

  // Validation errors
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message
    })
    return errors
  }
}

const signup_get = (req, res, next) => {
  res.render('signup')
}

const login_get = (req, res, next) => {
  res.render('login')
}

const signup_post = async (req, res, next) => {
  const { email, password } = req.body

  try {
    const user = await User.create({ email, password })
    res.status(201).json({
      status: true,
      user
    })
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({
      success: false,
      errors
    })
  }
}

const login_post = async (req, res, next) => {
  const { email, password } = req.body

  try {
    const user = await User.find({ email: email })
    res.status(200).json({
      success: true,
      user: user[0]
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
