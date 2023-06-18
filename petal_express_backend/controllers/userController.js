require('dotenv').config()
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let userModel = require("../models/userModel");

const registerUser = (
    [
        check("name", "Name is required").not().isEmpty(),
        check("email", "Please enter valid email").isEmail(),
        check("password", "Please enter a password with 3 or more characters").isLength({min: 3}),
    ],
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
        }

        try {
            //check if user email is already in the database
            let user1 = await userModel.findOne({ email: req.body.email });
            if (user1) {
                return res.status(400).json({ error: [{ msg: "user already exists" }] });
            }

            //hash the password
            hashedPassword = await bcrypt.hash(req.body.password, 12);

            //create a user
            const newUser = new userModel({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
            });

            //save the user
            await newUser.save();

            //generate token
            const payload = {
                user: {
                id: newUser.id,
                name: newUser.name,
                },
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
);

module.exports = { registerUser };
