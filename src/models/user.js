const mongoose = require('mongoose')
const validator = require("validator")
const JWT = require("jsonwebtoken")
const bcrypt = require("bcrypt")


const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{type:String},
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email address :"+value)
            }
        }
    },
    password:{
        type:String,
        required:true,
        minLength:8,
        
        validate(value){
    if(!validator.isStrongPassword(value)) {
        throw new Error("Please Enter a Strong Password"+value)
    }
}  
    },
    age:{type:Number},
    gender:{
        type:String,
        enum:{
            values:["male","female","other"],
            message:`{VALUE} is not a valid gender type`
        }
    }

})


userSchema.methods.getJWT = async function(){
    const user = this

    const token = await JWT.sign({_id:user._id},"DevTinder@123",{expiresIn:"1d"})

    return token
}


userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this
    const passwordHash = this.password

    const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash)

    return isPasswordValid
}


const User = mongoose.model("User",userSchema)

module.exports = User;