const express = require('express')
const app = express()
const connectDB = require("../src/config/database")
const User = require("../src/models/user")
const cors = require("cors")


const JWT = require("jsonwebtoken")
const cookieParser = require("cookie-parser")

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const userRouter = require("./routes/user")
const adminAuthRouter = require("./routes/adminAuth")
const adminProfileRouter = require("./routes/adminProfile")




app.use(express.json())
app.use(cookieParser())
app.use(cors({
   origin: "http://localhost:5173",  // Your frontend's origin
   methods: ['GET', 'POST', 'PATCH', 'DELETE'],  // Make sure PATCH is included
   allowedHeaders: ['Content-Type', 'Authorization'],
   credentials: true  // Allow credentials (cookies)
}));
app.options('*', cors());
app.options('/profile/edit', (req, res) => {
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
   res.setHeader('Access-Control-Allow-Credentials', 'true');
   res.sendStatus(204); // No content for OPTIONS request
 });
 


app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)
app.use("/",adminAuthRouter)
app.use("/",adminProfileRouter)












    connectDB ().then(()=>{
        console.log("DB Connected successfully....!!!!")
        app.listen(4001,()=>console.log("app started"))
     }).catch((err)=>{
        console.log("DB not Connected....!!!!")
     })

