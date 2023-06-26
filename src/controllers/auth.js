import User from "../models/user.js"

export const login=(req,res)=>{
    res.send("hiiiiiiiiiiii")
}

export const register=async(req,res)=>{
    const newUser =new User(req.body)
    const response =await newUser.save()
    console.log(req.body);
res.status(200).json(response)
}