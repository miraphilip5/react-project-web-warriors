const express = require("express");
const router = express.Router();

const { registerUser } = require("../controllers/userController");

// post api/user - insert User
router.post("/", registerUser);

module.exports = router;
