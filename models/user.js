const mongoose = require("mongoose");
const argon2 = require('argon2');
const schema = mongoose.Schema;
const userschema = new schema({
    username:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true,
    },
    name:{
        type:String,
        require:true,
    },
    gender:{
        type:String,
        require:true,
    },
    profile:{
        type:String,
        default:null
    },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    email:{
        type:String,
        require:true,
        unique:true
    },
    friends: [{
        friendId: {
            type: schema.Types.ObjectId, // Use ObjectId to reference another user
            ref: 'users', // Reference to the User model
            required: true,
        },
        friendName: {
            type: String,
            required: true,
        },
    }],
})
userschema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
      // Hash the password using Argon2
      this.password = await argon2.hash(this.password);
      next();
    } catch (err) {
      return next(err);
    }
  });
module.exports = mongoose.model("users",userschema);