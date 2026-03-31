const userModel=require('../models/usermodel');
const bcrypt= require("bcrypt");
const jwt = require("jsonwebtoken");


const registeruser=async (req,res) => {
    try{
        const {username,email,password}=req.body; 
        const existingUser=await userModel.findOne({email});

        if(existingUser){
            return res.status(400).json({
                message: "User already exists"
            });
        }
        
        const hassedpassword=await bcrypt.hash (password,10);
        const newuser=new userModel({username,email,password:hassedpassword});
        await newuser.save();
        
        const token = jwt.sign(
            { userid: newuser._id },
            "mysecretkey",
            { expiresIn: "1h" }
        );
        
        res.status(201).json({
            message:"User created successfully",
            user: {
                id: newuser._id,
                username: newuser.username,
                email: newuser.email
            },
            token:token
        });
    }
    catch (err){
        console.log(err);
        res.status(500).json({message:"User creation failed"});
    }
}
const updateUser = async (req, res) => {
    try {
        const userId = req.user.userid;
        const updateData = req.body; 
         
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select('-password');
        
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        });
         
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "User failed to update" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.user.userid;
        const deletedUser = await userModel.findByIdAndDelete(userId);
        
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json({ message: "User deleted successfully" });
        
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "User failed to delete" });
    }
};



const loginUser=async (req,res) => {
    try{
        const {email,password}=req.body;
        
        const user=await userModel.findOne({email});
        
        if(!user){
            return res.status (404).json({message:"User not found"});
        }
        
        const ismatch =await bcrypt.compare(password,user.password);
        
        if(!ismatch){
            return res.status (401).json({message:"Invalid credentials"});
        }

        const token =jwt.sign (
           { userid:user._id},
            "mysecretkey",
            {expiresIn:"1h"}
        );
        
        res.status(200).json({
            message:"Login successful",
            token:token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    }
     catch (Err){
        console.log("Login error:", Err);
        res.status(500).json({message:"Login failed"});
     }
}
module.exports = { registeruser, loginUser, updateUser, deleteUser };