require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const path = require("path");
const userRoute = require('./Routes/user')
const blogRoute = require('./Routes/blog')
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./Middlewares/authentication");

const Blog = require('./Models/blog')


const port = process.env.PORT || 7000;
const app = express();

mongoose.connect(process.env.MONGO_URL).then((e)=>console.log("MongoDB Connected"))



app.set("view engine", "ejs");
app.set("views", path.resolve("./Views"))

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')))

app.get("/",async(req,res)=>{
    const allBlogs = await Blog.find({})
    res.render("home",{
        user: req.user,
        blogs: allBlogs,
    })
})

app.use('/user',userRoute);
app.use('/blog',blogRoute);

app.listen(port,()=>{`Server started at Port:${port}`});
