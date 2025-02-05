const express = require("express")
const { userAuth } = require("../middlewares/auth")
const requestRouter = express.Router()
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user")


requestRouter.post("/request/send/:status/:userId",userAuth, async (req,res)=>{

    try {
        
        const status = req.params.status;
        const toUserId = req.params.userId;
        const fromUserId = req.user._id;
        
        // Checking status 
        const allowedStatus = ["interested","ignored"]
        if(!allowedStatus.includes(status)){
            throw new Error("Status is Invalid")
        }

        //Check user is exist or not
        const user = await User.findOne({_id:toUserId})
        if(!user){
            throw new Error("User is not Exist...!!!")
        }

        //check if request already exist
        const existingRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId:fromUserId,toUserId:toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        })

        if(existingRequest){
            throw new Error("Request already exist....!!!")
        }


        const newConnectionRequest = new ConnectionRequest({
            toUserId,
            fromUserId,
            status
        })

        const data = await newConnectionRequest.save()
        res.json({message:req.user.firstName+ "is"+status+ user.firstName,data})


    } catch (error) {
        res.status(400).send("ERROR :"+error.message)
    }
})



module.exports = requestRouter