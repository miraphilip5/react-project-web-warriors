require('dotenv').config()
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const auth = require("../middleware/authMiddleware");
let userModel = require("../models/userModel");

const getLoggedInUser = ( auth, async (req, res) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //use the user model to get user info except password
      const user = await userModel.findById(decoded.user.id).select("-password");
      if (!user) {
        return res.status(401).json({ msg: "User not found" });
      }
  
      res.json({ name: user.name });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);

const  loginUser = (
    [
        check("email", "Please include valid email").isEmail(),
        check("password", "Password is required").exists(),
    ],

    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        try {
            //see if user exists
            let user = await userModel.findOne({ email });
            if (!user) {
                return res.status(400).json({ errors: [{ msg: "invalid credentials" }] });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: "invalid credentials" }] });
            }

            //get user info for payload from mongo
            const payload = {
                user: {
                id: user.id,
                name: user.name,
                },
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '90d' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

module.exports = { loginUser, getLoggedInUser };
