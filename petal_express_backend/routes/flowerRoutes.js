const express = require("express");
const router = express.Router();

const { getFlowers, addFlower, updateFlowerById, deleteFlowerById } = require("../controllers/flowerController");

//get all flowers
router.get("/", getFlowers);

//post-insert a flower
router.post("/", addFlower);

//put-update a flower
router.put("/:id", updateFlowerById);

//delete a flower
router.delete("/:id", deleteFlowerById);

module.exports = router;
