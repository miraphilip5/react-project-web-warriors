const mongoose = require("mongoose");
// since all the api methods are async, we need to use either try-catch or .then structure, to avoid using any of them
// we can alternatively use asyncHandler (simply wrap async in this)
const asyncHandler = require("express-async-handler");
// importing cartModel (that holds the mongoDB db schema)
const cartModel = require("../models/cartModel");
// importing jwt to check if the user is authenticated
const jwt = require("jsonwebtoken");
const auth = require("../middleware/authMiddleware");


// since mongoose methods return a promise, we need to use async for all of these methods
//  @route GET /api/carts
// const getCartByUserId = [auth,asyncHandler(async (req, res) => {
const getCartByUserId = asyncHandler(async (req, res) => {
    // get u_id from auth later
  const u_id = "6487bc04e2665dfa761904d0";
  const cart = await cartModel.findOne({ u_id: u_id }).exec();

  // if id not found in the db
  if (!cart) {
    res.status(400);
    //throw new Error(`The cart with id ${u_id} doesn't exist!`);
  }
  res.status(200).json(cart);
});

//  @route POST /api/carts
const saveToCart = asyncHandler(async (req, res) => {
    // get u_id from auth later
    const u_id = "6487bc04e2665dfa761904d1";
    const { flower } = req.body;
    const { f_id, quantity } = flower[0];
    console.log(`Quantity is ${quantity}`);
  
    try {
      // Check if cart with u_id already exists in the database
      let cart = await cartModel.findOne({ u_id });
  
      if (cart) {
        console.log('im here1');
        // If cart exists, check if flower with f_id already exists in the cart
        const existingFlower = cart.flower.find(item => item.f_id === f_id);
  
        if (existingFlower) {
          // If flower exists, update its quantity
          existingFlower.quantity = quantity;
        } else {
          // If flower doesn't exist, add it to the cart
          cart.flower.push({ f_id, quantity });
        }
  
        // Save the updated cart
        cart = await cart.save();
      } else {
        console.log('im here2');
        // If cart doesn't exist, create a new cart with the provided data
        cart = await cartModel.create({ u_id, flower: [{ f_id, quantity }] });
      }
  
      res.status(200).json(cart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

//  @route DELETE /api/carts
const deleteCartByUserId = async (req, res) => {
    // get u_id from auth later
    const u_id = "6487bc04e2665dfa761904d0";
    // converting to objectId
    const objectId = new mongoose.Types.ObjectId(u_id);
    console.log(objectId);
    const cart = await cartModel.findOne({ objectId });
  // if id not found in the db
  if (!cart) {
    res.status(400);
    throw new Error(`The cart with user id ${u_id} doesn't exist!`);
  }
  const deletedCart = await cartModel.findByIdAndDelete(u_id); //new:true will return the data after the delete
  res.status(200).json(deletedCart);
};

module.exports = { getCartByUserId, saveToCart, deleteCartByUserId};
