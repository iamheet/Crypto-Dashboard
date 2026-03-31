const {body,validationResult}=require('express-validator');

const contactValidation=[
    body("name")
    .notEmpty()
    .withMessage("Name is required"),
    body("email")
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid Email"),
    
  body("subject")
    .notEmpty()
    .withMessage("Subject is required"),

  body("message")
    .notEmpty()
    .withMessage("Message is required"),
    (req,res,next)=>{
        const error=validationResult(req);
        if(!error.isEmpty()){
           return res.status(422).json({
            message:"Things Missing",
            error:error.array().map(err => err.msg)})
        }
        next();
    }
];
module.exports=contactValidation;

















