const  express = require('express');
const router=express.Router();
 const { sendmessage } = require('../controllers/contactController')
 const contactValidation = require("../middleware/contactValidation");
 router.post("/sendmessage",contactValidation,sendmessage);

 module.exports=router;
