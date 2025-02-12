const express = require("express")
const profileRouter = express.Router()
const { userAuth } = require("../middlewares/auth")
const { validateEditProfileData} = require("../utils/validation")


profileRouter.get("/profile/view",userAuth,(req,res)=>{

    try {
      const user = req.user
      res.send(user)
    } catch (error) {
      res.status(401).send("ERROR :"+error.message)
    }
      
  })


  profileRouter.patch("/profile/edit",userAuth, async (req,res)=>{
    console.log(req.body)
    try {
        
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Fields....!!!!")
        }

        const loggedInUser = req.user
        Object.keys(req.body).forEach((key)=>( loggedInUser[key] = req.body[key]))
        await loggedInUser.save()
        console.log(loggedInUser)
        res.status(200).json({message:`${loggedInUser.firstName} , Your Profile Updated Successfully....!!!!`,data:loggedInUser})




    } catch(error) {
        res.status(400).send("ERROR :"+error.message)
    }
        
    
        
    
  })




module.exports = profileRouter