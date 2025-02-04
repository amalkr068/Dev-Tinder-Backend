const express = require('express')
const app = express()

app.get("/",(req,res)=>{res.send("send page")})


app.listen(4001,()=>console.log("app started"))