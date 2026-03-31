const express = require('express');

const router = express.Router();

const { registeruser, loginUser, updateUser, deleteUser } = require('../controllers/authcontroller');
const verifyToken=require('../middleware/authMiddleware')
const { updateSubscription } = require("../controllers/subscriptioncontoller");
const User = require('../models/usermodel');  

router.post('/register', registeruser);
router.post('/login', loginUser);
router.post('/upgrade', updateSubscription);
router.put('/update', verifyToken, updateUser);
router.delete("/deleteuser", verifyToken, deleteUser);


router.get('/profile',verifyToken,async(req,res)=>{
    try{ 
        const user = await User.findById(req.user.userid).select('-password');
    res.json({message:"profile accessed",user:user});}
    catch (error) {

    res.status(500).json({
      message: "Error fetching profile"
    });
}
  
});



module.exports = router;