const express=require("express");
const router= express.Router();

router.get("/prices",async(req,res)=>{
  const plans = [
    {
      id: "basic",
      name: "Basic",
      monthlyPrice: 23,
      yearlyPrice: 230,
      savings: "Save $46/year",
      features: [
        "Portfolio tracking up to 10 assets",
        "Basic price alerts",
        "Email support",
        "Mobile app access"
      ],
      popular: false
    },
    {
      id: "pro",
      name: "Pro",
      monthlyPrice: 39,
      yearlyPrice: 390,
      savings: "Save $78/year",
      features: [
        "Unlimited portfolio tracking",
        "Advanced AI analytics",
        "Real-time alerts",
        "Priority support",
        "API access"
      ],
      popular: true
    },
    {
      id: "premium",
      name: "Premium",
      monthlyPrice: 79,
      yearlyPrice: 790,
      savings: "Save $158/year",
      features: [
        "Everything in Pro",
        "Advanced AI trading insights",
        "Institutional-level analytics",
        "24/7 dedicated support",
        "Early access to new features"
      ],
      popular: false
    }
  ];
res.json({message:"All plans Fetch sucessfully" ,plans})

})
module.exports =router;