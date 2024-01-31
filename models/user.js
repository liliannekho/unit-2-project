require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: String,
    email: String, 
    password: String
})

//this is where the encryption happens 
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 8)
    }
    next()
  })

//the above listens for the save and then will update the password and re-encrypt the password 

userSchema.methods.generateAuthToken = async function(){
    const token = jwt.sign({ _id: this._id}, 'secret')
    return token
}

const User = mongoose.model('User', userSchema)

module.exports = User