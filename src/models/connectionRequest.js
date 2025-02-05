const mongoose = require("mongoose")
const User = require("./user")


const connectionRequestSchema = mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["interested","ignored","accepted","rejected"],
            message:`{VALUE} is invalid status type`
        }
    },
    

},{timestamps:true})


connectionRequestSchema.index({fromUserId:1 , toUserId:1})



connectionRequestSchema.pre("save",function(next){
    const connectionRequest = this

    //check the from userId is same as touserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Can't sent to yourself")
    }
    next()
})


const ConnectionRequestModel = mongoose.model("connectionRequest",connectionRequestSchema)
module.exports = ConnectionRequestModel;