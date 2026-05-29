require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

if (!process.env.MONGO_URI) {
  console.error('FATAL: MONGO_URI environment variable is not set.');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log("Failed to connect to MongoDB", err));

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

const authroutes = require('./routes/auth');
const pricingroutes = require('./routes/pricing');
const subscriptionroutes = require('./routes/subscription');
const contactroutes = require('./routes/contact');

app.use('/api/auth', authroutes);
app.use('/api/pricing', pricingroutes);
app.use('/api/subscription', subscriptionroutes);
app.use('/api/contact', contactroutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
