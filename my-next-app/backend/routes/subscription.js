const express = require("express");

const router = express.Router();

const { sendmessage } = require("../controllers/contactController");

router.post("/send", sendmessage);

module.exports = router;