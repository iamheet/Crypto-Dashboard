const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/CryptoNexus")
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log("Failed to connect to MongoDB", err));

app.use(cors());
app.use(express.json());

const authroutes = require('./routes/auth');
const pricingroutes=require('./routes/pricing')
const subscriptionroutes=require('./routes/subscription')
const contactroutes=require('./routes/contact')

app.use('/api/auth', authroutes);
app.use('/api/pricing', pricingroutes);
app.use('/api/subscription',subscriptionroutes)
app.use('/api/contact',contactroutes)
app.listen(5000, () => {
  console.log("Server running on port 5000");
});