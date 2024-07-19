const userModel=require("../models/user")
const bcrypt=require("bcrypt")
const jwt= require("jsonwebtoken")
const dotenv=require("dotenv")
dotenv.config()
const SECRET_KEY=process.env.SECRET_KEY
const register=async (req,res)=>{
    /*
    4 steps:
    Existing user check
    Hashed password
    User Creation
    Token Generation
    */
    // console.log("Request: "+req.method+" URL "+req.url);
    const {email,username,password}=req.body;
    // console.log(username+email+password);
    try {  
        const existingUser=await userModel.findOne({email:email})
        if(existingUser){
            // console.log("user exists");
            // alert("user already exists")
            return res.status(400).json({message:"User Already Exists"})
        }
        
        const hashedPassword= await bcrypt.hash(password,10)

        const result= await userModel.create({
            email:email,
            username:username,
            password:hashedPassword
        });
        // console.log(SECRET_KEY);
        const token=jwt.sign({username:result.username,id:result._id},SECRET_KEY);
        res.status(200).json({user:result,token:token});    //201 means successfully record created...

    } catch (error) {
        // console.log(req);
        // console.log("passoword"+password+" name:"+username+" email:"+email);
        console.log(error);
        res.status(500).json({message:"something went wrong"});
    }
}
 
const login=async(req,res)=>{
    const {email,password}=req.body;
    try {
        const existingUser=await userModel.findOne({email:email})
        console.log("ExUser:",existingUser);
        if(!existingUser){
            console.log("user not found");
            return res.status(404).json({message:"user not found"})
        }
        //compare the two password
        const matchPassword=await bcrypt.compare(password,existingUser.password)
        if(!matchPassword){
            return res.status(400).json({message:"Invalid credentials"})
        }
        const token=jwt.sign({username:existingUser.username,id:existingUser._id},SECRET_KEY);
        res.cookie('token', token).status(201).json({id:existingUser._id,username:existingUser.username});
    } catch (error) {  
        console.log(error);
        res.status(500).json({message:"something went wrong"});
    }
}

const profile=(req,res)=>{
    const {token}=req.cookies;
    console.log("cookie:",token);
    if(!token) return res.status(401).json('Invalid user')
    jwt.verify(token,SECRET_KEY,{},(err,data)=>{
        if(err) throw err;
        console.log("data:",data);
        res.json(data)
    });
    // console.log('cookie',req.cookie);
    // res.json(req);
};

const logout=(req,res)=>{
    res.cookie('token', '').json('ok');
}

module.exports={register,login,profile,logout};