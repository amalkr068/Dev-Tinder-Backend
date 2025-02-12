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
        }).populate("fromUserId",["firstName","lastName","photoUrl","about","age","gender"])

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
        }).populate("fromUserId",["firstName","lastName","age","gender","about","photoUrl"]).populate("toUserId",["firstName","lastName","age","gender","about","photoUrl"])

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



userRouter.get("/feed",userAuth, async(req,res)=>{
    try {
        
        const loggedInUser = req.user
        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10
        limit = limit>50 ? 50 : limit
        const skip = (page - 1)*limit

        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        }).select("fromUserId toUserId")

        const hideUsersFromFeed = new Set()
        connectionRequests.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString())
            hideUsersFromFeed.add(req.toUserId.toString())
        })

        

        const users = await User.find({
            $and:[{_id:{$nin:Array.from(hideUsersFromFeed)}},
                {_id:{$ne:loggedInUser._id}}
            ]
        }).select("firstName lastName photoUrl age gender about").skip(skip).limit(limit)
        res.send(users)


    } catch (error) {
        res.status(400).send("ERROR :"+error.message)
    }
})


module.exports = userRouter