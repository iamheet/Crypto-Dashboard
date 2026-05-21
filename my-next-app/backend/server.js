const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

// ✅ CONNECT DB
mongoose.connect("mongodb+srv://iamheetchokshi_db_user:S6IjhHTtO7rLUw2a@cryptonexus.fx9fte6.mongodb.net/?appName=Cryptonexus")
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log("Failed to connect to MongoDB", err));

// ✅ CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// 🔥 ADD THIS (VERY IMPORTANT)
app.use(express.json());  // ✅ THIS FIXES YOUR ERROR

// ✅ ROUTES
const authroutes = require('./routes/auth');
const pricingroutes = require('./routes/pricing');
const subscriptionroutes = require('./routes/subscription');
const contactroutes = require('./routes/contact');

app.use('/api/auth', authroutes);
app.use('/api/pricing', pricingroutes);
app.use('/api/subscription', subscriptionroutes);
app.use('/api/contact', contactroutes);

// ✅ SERVER
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
