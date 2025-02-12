const express = require("express")
const adminAuthRouter = express.Router()
const {validateSignUpData} = require("../utils/validation")
const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")
const User = require("../models/user")




adminAuthRouter.post("/admin/signup",async (req,res)=>{

try {
    
    validateSignUpData(req)

    const { firstName,lastName,emailId,password,gender,age,isAdmin,about } = req.body
    console.log("ISAdmin :",isAdmin)
        const passwordHash = await bcrypt.hash(password,10)

        const newUser = new User({
            firstName:firstName,
            lastName:lastName,
            emailId:emailId,
            password:passwordHash,
            gender:gender,
            age:age,
            isAdmin:isAdmin,
            about:about
        })

        const user = await newUser.save()

        const token = await JWT.sign({_id:user._id},"DevTinderAdmin@123",{expiresIn:"1d"})

        const expirationDate = new Date();
       expirationDate.setTime(expirationDate.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
     
       res.cookie("token",token,{ expires: expirationDate})
       res.json({message:" Admin Data added successfully....!!!!", data:user})
       









} catch (error) {

    console.log("Error :",error)
}


})




adminAuthRouter.post("/admin/login",async (req,res)=>{

    const { emailId,password,isAdmin } = req.body

    try {
        
        
        if(!emailId || !password){
            throw new Error("Enter full Credentials...!!!")
        }

        const user = await User.findOne({emailId:emailId})
        if(!user){
            throw new Error("User Not Found")
        }

         const isPasswordValid = await bcrypt.compare(password,user.password)

         if(!isPasswordValid){
            throw new Error("Invalid Credentials")
         }

         if(isPasswordValid && user.isAdmin){
            const token = await JWT.sign({_id:user._id},"DevTinderAdmin@123",{expiresIn:"1d"})

            const expirationDate = new Date();
           expirationDate.setTime(expirationDate.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
         
           res.cookie("token",token,{ expires: expirationDate})
           res.json({message:"Successful...",user})
         }





    } catch (error) {
        res.status(400).send("Error :"+error.message)
    }
})



adminAuthRouter.post("/admin/logout",(req,res)=>{

    res.cookie("token",null,{expires:new Date(Date.now())})
    res.send(" Admin Logged out successful......!!!!!")

})



module.exports = adminAuthRouter;