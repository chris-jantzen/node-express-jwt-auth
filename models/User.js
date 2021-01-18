const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

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

// fire a funciton before doc saved to db
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// static method to login a user
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email })
  if (user) {
    const auth = await bcrypt.compare(password, user.password)
    if (auth) {
      return user
    }
    throw Error('Incorrect password')
  }
  throw Error(`Email "${email}" is not registered`)
}

module.exports = mongoose.model('user', userSchema)
