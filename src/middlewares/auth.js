const JWT = require("jsonwebtoken")
const User = require("../models/user")


const userAuth = async (req,res,next)=>{

    try {
        
        const { token } = req.cookies
        if(!token){
            throw new Error("Token is not available")
        }

       const decodeObj =  await JWT.verify(token,"DevTinder@123")

        const { _id } = decodeObj
        const user = await User.findById(_id)
        
        if(!user){
            throw new Error("User not found with this Token")
        }

        req.user = user
        next()




    } catch (error) {
        res.status(400).send("Error :"+error)
    }





}


const adminAuth = async (req,res,next)=>{

    try {
        
        const { token } = req.cookies
        if(!token){
            throw new Error("Token is not available")
        }

       const decodeObj =  await JWT.verify(token,"DevTinderAdmin@123")

        const { _id } = decodeObj
        const user = await User.findOne({_id:_id,isAdmin:true})
        
        if(!user){
            throw new Error("Admin not found with this Token")
        }

        req.admin = user
        next()




    } catch (error) {
        res.status(400).send("Error :"+error)
    }





}


module.exports = { userAuth,adminAuth }