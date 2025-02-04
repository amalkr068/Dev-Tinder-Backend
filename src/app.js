const express = require('express')
const app = express()
const connectDB = require("../src/config/database")
const User = require("../src/models/user")
const {validateSignUpData} = require("../src/utils/validation")
const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const { userAuth } = require("../src/middlewares/auth")



app.use(express.json())
app.use(cookieParser())

app.post("/signup",async (req,res)=>{

    try {

        validateSignUpData(req)

        const { firstName,lastName,emailId,password,gender,age } = req.body
        const passwordHash = await bcrypt.hash(password,10)

        const newUser = new User({
            firstName:firstName,
            lastName:lastName,
            emailId:emailId,
            password:passwordHash,
            gender:gender,
            age:age
        })

        await newUser.save()
        res.send("Data added successfully....!!!!")

    } catch (error) {
        console.log(error)
    }
   
})

app.post("/login",async(req,res)=>{

    const { emailId,password } = req.body
    

    try {

        if(!emailId || !password){
            throw new Error("Enter full Credentials...!!!")
        }

        const user = await User.findOne({emailId:emailId})
        if(!user){
            throw new Error("User Not Found")
        }
    
        const isPasswordValid = await user.validatePassword(password)
    
        if(isPasswordValid){

            const token = await user.getJWT()
          
            res.cookie("token",token)
            res.send("Log in Successful....!!!")

        }else {
            throw new Error("Password is not Correct")
        }
    } catch (error) {
        res.status(400).send("Error :"+error.message)
    }

   
})



app.get("/profile",userAuth,(req,res)=>{

  try {
  
    res.send("Profile Page.....!!!!")
  } catch (error) {
    console.log(error)
  }
    
})






    connectDB ().then(()=>{
        console.log("DB Connected successfully....!!!!")
        app.listen(4001,()=>console.log("app started"))
     }).catch((err)=>{
        console.log("DB not Connected....!!!!")
     })

