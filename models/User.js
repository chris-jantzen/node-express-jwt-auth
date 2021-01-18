const mongoose = require('mongoose')
const { isEmail } = require('validator')

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'An email is required'],
      unique: true,
      lowercase: true,
      validate: [isEmail, 'A valid email is required']
    },
    password: {
      type: String,
      required: [true, 'A password is required'],
      minlength: [6, 'Minimum password length is 6 characters']
    }
  },
  {
    collection: 'user',
    timestamps: true
  }
)

module.exports = mongoose.model('user', userSchema)
