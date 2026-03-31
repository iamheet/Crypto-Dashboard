const User = require('../models/usermodel');

const updateSubscription = async (req, res) => {

  try {

    const { price, plan, user_id } = req.body;
    
    console.log('Received subscription update request:');
    console.log('user_id:', user_id);
    console.log('plan:', plan);
    console.log('price:', price);

    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      {
        "subscription.plan": plan,
        "subscription.price": price
      },
      { new: true }
    );

    if (!updatedUser) {
      console.log('User not found with ID:', user_id);
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    console.log('Subscription updated successfully for user:', updatedUser._id);
    
    res.status(200).json({
      success: true,
      message: "Subscription updated successfully",
      user: updatedUser
    });

  } catch (err) {

    console.log('Subscription update error:', err.message);
    console.log('Full error:', err);

    res.status(400).json({
      success: false,
      message: "Subscription update failed: " + err.message
    });

  }

};

module.exports = { updateSubscription };