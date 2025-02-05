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

requestRouter.post("/request/review/:status/:requestId",userAuth, async(req,res)=>{
    try {
        
        const loggedInUser = req.user
        const { status,requestId } = req.params
        const allowedStatus = ["accepted","rejected"]
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Status is Invalid.....!!!!"})
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUser,
            status:"interested"
        })

        if(!connectionRequest){
            return res.status(400).json({message:"Connection Request is not found....!!!!"})
        }

        connectionRequest.status = status
        const data = await connectionRequest.save()
        res.json({message:"Connection Request "+status , data})




    } catch (error) {
        res.status(400).send("ERROR :"+error.message)
    }
})

module.exports = requestRouter