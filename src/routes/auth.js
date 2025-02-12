const express = require("express")
const authRouter = express.Router()
const User = require("../models/user")
const {validateSignUpData} = require("../utils/validation")
const bcrypt = require("bcrypt")


authRouter.post("/signup",async (req,res)=>{

    try {

        validateSignUpData(req)

        const { firstName,lastName,emailId,password,gender,age,photoUrl } = req.body
        const passwordHash = await bcrypt.hash(password,10)

        const newUser = new User({
            firstName:firstName,
            lastName:lastName,
            emailId:emailId,
            password:passwordHash,
            gender:gender,
            age:age,
            photoUrl:photoUrl
        })

       const savedUser = await newUser.save()

       const token = await savedUser.getJWT()
       const expirationDate = new Date();
       expirationDate.setTime(expirationDate.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
     
       res.cookie("token",token,{ expires: expirationDate})

        res.json({message:"Data added successfully....!!!!", data:savedUser})

    } catch (error) {
        console.log(error)
    }
   
})



authRouter.post("/login",async(req,res)=>{

    const { emailId,password } = req.body
    

    try {

        if(!emailId || !password){
            throw new Error("Enter full Credentials...!!!")
        }

        const user = await User.findOne({emailId:emailId})
        if(!user){
            throw new Error("User Not Found")
        }
        
        if(user.isBlocked == "true"){
            throw new Error("User is Blocked")
        }
        const isPasswordValid = await user.validatePassword(password)
    
        if(isPasswordValid){

            const token = await user.getJWT()
            const expirationDate = new Date();
            expirationDate.setTime(expirationDate.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
          
            res.cookie("token",token,{ expires: expirationDate})
            res.json({message:"Successful...",user})

        }else {
            throw new Error("Password is not Correct")
        }
    } catch (error) {
        res.status(400).send("Error :"+error.message)
    }

   
})


authRouter.post("/logout",(req,res)=>{

    res.cookie("token",null,{expires:new Date(Date.now())})
    res.send("Log out successful......!!!!!")

})


module.exports = authRouter