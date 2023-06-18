const express = require("express");
const router = express.Router();

const { getLoggedInUser, loginUser  } = require("../controllers/authController");

// post api/auth - authenticate User
router.post("/", loginUser);

// get api/auth - get logged in user info
router.get("/", getLoggedInUser);

module.exports = router;
