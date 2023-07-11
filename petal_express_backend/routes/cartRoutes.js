const express = require("express");
const router = express.Router();

const {
  getCartByUserId,
  saveToCart,
  deleteCartByUserId,
  deleteCartByFlowerId,
  updateQuantityByFlowerId,
} = require("../controllers/cartController");

//get cart by user id
router.get("/", getCartByUserId);

//post(add/update) to cart
router.post("/", saveToCart);

//delete from cart (by user id) i.e. when moving items to orders (deleting all cart records of a specific user)
router.delete("/", deleteCartByUserId);

//delete from cart (by user id and by flower id) i.e. deleting just 1 card record of a specific user by specific flower
router.delete("/:id", deleteCartByFlowerId);

//put-update(increase or reduce) quantity for a specific cart record by flower id (and obviously for a specific user)
router.put("/:id/:operation", updateQuantityByFlowerId);

module.exports = router;
