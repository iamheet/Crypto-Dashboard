const newcontact = require('../models/contactmodal');

const sendmessage=async(req,res)=>{
    try{
        const{name,email,category,subject,message}=req.body;
        const newmessage =newcontact({
            name,email,category,subject,message});
        await newmessage.save();
        res.status(201).json({
            success:true,
            message:"message sent Successfully"})
    }
    catch(Err)
    {
        res.status(400).json({
            success:false,
            message:"Failed to send message"});
    }
} 

module.exports={sendmessage};
