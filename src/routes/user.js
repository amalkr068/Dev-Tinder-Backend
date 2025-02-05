const express = require("express")
const User = require("../models/user")
const { userAuth } = require("../middlewares/auth")
const userRouter = express.Router()
const ConnectionRequest = require("../models/connectionRequest")

userRouter.get("/user/requests/recieved",userAuth , async (req,res)=>{
    try {
        
        const loggedInUser = req.user
        const data = await ConnectionRequest.find({
            toUserId:loggedInUser,
            status:"interested"
        }).populate("fromUserId",["firstName","lastName"])

        res.json({data})





    } catch (error) {
        res.status(400).send("ERROR :"+error.message)
    }
})



userRouter.get("/user/connections",userAuth, async (req,res)=>{
    try {

        const loggedInUser = req.user
        const connectionRequest = await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id , status:"accepted"},
                {fromUserId:loggedInUser._id , status:"accepted"}
            ]
        }).populate("fromUserId",["firstName","lastName"]).populate("toUserId",["firstName","lastName"])

        const data = connectionRequest.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){

                return  row.toUserId
            }
            return row.fromUserId
        })

        res.json({data})
        
    } catch (error) {
        res.status(400).send("ERROR :"+error.message)
    }
})


module.exports = userRouter