// routes/host.js ✅
const express = require("express");
const router = express.Router();
const { isLoggedIn, isHost } = require("../middleware");
const hostController = require("../controllers/host");

router.get("/dashboard", isLoggedIn, isHost, hostController.dashboard);

module.exports = router;
