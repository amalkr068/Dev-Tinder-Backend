const express = require('express')
const app = express()
const connectDB = require("../src/config/database")
const User = require("../src/models/user")


const JWT = require("jsonwebtoken")
const cookieParser = require("cookie-parser")

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const userRouter = require("./routes/user")




app.use(express.json())
app.use(cookieParser())


app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)












    connectDB ().then(()=>{
        console.log("DB Connected successfully....!!!!")
        app.listen(4001,()=>console.log("app started"))
     }).catch((err)=>{
        console.log("DB not Connected....!!!!")
     })

