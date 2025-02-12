const express = require("express")
const adminProfileRouter = express.Router()
const User = require("../models/user")
const {validateEditProfileData, adminValidateEditProfileData} = require("../utils/validation")
const bcrypt = require("bcrypt")
const {adminAuth} = require("../middlewares/auth")


adminProfileRouter.get("/admin/allusers",adminAuth,async (req,res)=>{
    try {
        
        const users = await User.find({isAdmin:false})
        if(!users){
            throw new Error("Users not found")
        }
        
        return res.status(200).json({users})
        



    } catch (error) {
        res.status(400).send("Error :"+error.message)
    }
})





adminProfileRouter.post("/admin/manageuser/:action/:userId",adminAuth,async (req,res)=>{

    try {
        
        const {userId,action} = req.params;

        const user = await User.findOne({_id:userId})
        if(!user){
            throw new Error("User not found")
        }

        user.isBlocked = action;
        await user.save()
        const users = await User.find({isAdmin:false})
        return res.json({users})






    } catch (error) {
        res.status(400).send("Error :"+error.message)
    }
})




adminProfileRouter.patch("/admin/edituser/:userId",adminAuth,async(req,res)=>{

    try {
        const {password} = req.body
        const userId = req.params.userId

        if(! adminValidateEditProfileData(req)){
            throw new Error("Invalid Edit Fields....!!!!")
        }

        const user = await User.findOne({_id:userId})

        const passwordHash = await bcrypt.hash(password,10)
        req.body.password = passwordHash;

        Object.keys(req.body).forEach((key)=>( user[key] = req.body[key]))
        await user.save()
        const newuser = await User.find({isAdmin:false})

        res.json({message:"Data updated successfully",newuser})





    } catch (error) {
        res.status(400).send("Error :"+error.message)
    }
})


module.exports = adminProfileRouter;