const { Router } = require('express')
const authController = require('../controllers/authController')

const router = Router()

router
  .route('/signup')
  .get(authController.signup_get)
  .post(authController.signup_post)

router
  .route('/login')
  .get(authController.login_get)
  .post(authController.login_post)

// router.get('/logout', (req, res, next) => {})

module.exports = {
  authRouter: router
}
