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
const getCartByUserId = [auth,asyncHandler(async (req, res) => {
//   const u_id = new mongoose.Types.ObjectId("6487bc04e2665dfa761904d1");
// since auth(middleware) stores the user info in the request (can be seen in the code of the middleware-authMiddleware.js)
    const u_id = req.user.id;

  try {
    const carts = await cartModel.find({ u_id }).exec();
    res.status(200).json(carts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
})];

//  @route POST /api/carts
const saveToCart = [auth,asyncHandler(async (req, res) => {
//   const u_id = new mongoose.Types.ObjectId("6487bc04e2665dfa761904d1");
// since auth(middleware) stores the user info in the request (can be seen in the code of the middleware-authMiddleware.js)
const u_id = req.user.id;
  const { f_id, quantity, name, price } = req.body;

  try {
    // get carts with given u_id
    let carts = await cartModel.find({ u_id });

    if (carts.length > 0) {
      // Case1: If cart with u_id exists, check if cart with f_id already exists in the cart
      const existingCart = carts.find((cart) => cart.f_id === f_id);

      if (existingCart) {
        // Case1.1: If cart record with same u_id and same f_id exists, simply update its quantity
        existingCart.quantity += quantity;

        // Save the updated cart
        await existingCart.save();
      } else {
        // Case1.2: If cart with u_id already exists but f_id doesn't exist in the cart,
        // create a new cart with the same u_id but a new(given) f_id
        const newCartwithSameUserId = new cartModel({
          u_id,
          f_id,
          quantity,
          name,
          price
        });

        carts.push(newCartwithSameUserId);
        await newCartwithSameUserId.save();
      }
    } else {
      // Case2: If cart with the u_id doesn't exist, create a new cart with the provided data
      const newCartwithDifferentUserId = new cartModel({
        u_id,
        f_id,
        quantity,
        name,
        price
      });

      carts.push(newCartwithDifferentUserId);
      await newCartwithDifferentUserId.save();
    }

    res.status(200).json(carts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
})];

//  @route DELETE /api/carts
//delete all the cart records with a u_id
const deleteCartByUserId = [auth,async (req, res) => {
//   const u_id = new mongoose.Types.ObjectId("6487bc04e2665dfa761904d1");
// since auth(middleware) stores the user info in the request (can be seen in the code of the middleware-authMiddleware.js)
const u_id = req.user.id;

  try {
    const deletedCarts = await cartModel.deleteMany({ u_id });
    res.status(200).json(deletedCarts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}];

//  @route DELETE /api/carts/:id
//delete a cart record with a u_id and a flower_id
const deleteCartByFlowerId = [auth,async (req, res) => {
//   const u_id = new mongoose.Types.ObjectId("6487bc04e2665dfa761904d1");
// since auth(middleware) stores the user info in the request (can be seen in the code of the middleware-authMiddleware.js)
const u_id = req.user.id;
  const f_id = Number(req.params.id);

  try {
    const carts = await cartModel.find({ u_id });
    const cartToDelete = carts.find((cart) => cart.f_id === f_id);
    if (!cartToDelete) {
      res
        .status(400)
        .json({ error: `Cart with u_id ${u_id} and f_id ${f_id} not found!` });
      return;
    }

    await cartModel.findByIdAndDelete(cartToDelete._id);

    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}];

// @route PUT /api/carts/:id/:operation
// operation = increase or reduce to update(increase or reduce) quantity respectively
const updateQuantityByFlowerId = [auth,async (req, res) => {
//   const u_id = new mongoose.Types.ObjectId("6487bc04e2665dfa761904d1");
// since auth(middleware) stores the user info in the request (can be seen in the code of the middleware-authMiddleware.js)
const u_id = req.user.id;
  const f_id = Number(req.params.id);
  //   get the operation string from the api endpoint (i.e. increase or reduce)
  const operation = req.params.operation;

  try {
    const carts = await cartModel.find({ u_id });
    const cartToUpdate = carts.find((cart) => cart.f_id === f_id);

    if (!cartToUpdate) {
      res
        .status(400)
        .json({ error: `Cart with u_id ${u_id} and f_id ${f_id} not found!` });
      return;
    }

    if (operation === "increase") {
      cartToUpdate.quantity += 1;
      await cartToUpdate.save();
      res.status(200).json({ message: `Quantity for user ${u_id} and flower ${f_id} increased successfully` });
    } else if (operation === "reduce") {
      cartToUpdate.quantity -= 1;
      if ( cartToUpdate.quantity >= 1)
        await cartToUpdate.save();
      else 
        await cartToUpdate.deleteOne({f_id});
      res.status(200).json({ message: `Quantity for user ${u_id} and flower ${f_id} reduced successfully` });
    } else {
      res
        .status(400)
        .json({
          error: `Invalid operation: pass either increase or reduce in the api endpoint`,
        });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}];

module.exports = {
  getCartByUserId,
  saveToCart,
  deleteCartByUserId,
  deleteCartByFlowerId,
  updateQuantityByFlowerId,
};
