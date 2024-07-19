const express=require("express");
const { register,login,profile,logout } = require("../controllers/userController");

const userRouter=express.Router();

userRouter.post("/register",register)

userRouter.post("/login",login)

userRouter.get("/profile",profile)

userRouter.post("/logout",logout)

module.exports=userRouter