const mongoose=require('mongoose');

const contactSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    category:{
        type:String,
        default:"general",
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    }
    
       
    
},{timestamp:true},);
module.exports=mongoose.models.Contact || mongoose.model('Contact',contactSchema)



















