const express = require("express");
const router = express.Router();

const { getCartByUserId, saveToCart, deleteCartByUserId} = require("../controllers/cartController");


//get cart by user id
router.get("/",getCartByUserId)

//post(add/update) to cart
router.post("/", saveToCart);

//delete from cart
router.delete("/", deleteCartByUserId);

module.exports = router;
