const mongoose = require("mongoose");
// since all the api methods are async, we need to use either try-catch or .then structure, to avoid using any of them
// we can alternatively use asyncHandler (simply wrap async in this)
const asyncHandler = require("express-async-handler");
// importing flowerModel (that holds the mongoDB db schema)
const flowerModel = require("../models/flowerModel");

// since mongoose methods return a promise, we need to use async for all of these methods
//  @route GET /api/flowers
const getFlowers = asyncHandler(async (req, res) => {
  // set this filter from the parameter later
  const filter = {};
  const flowers = await flowerModel.find().sort({ f_id: 1 }).exec(); // Sort by f_id in ascending order
  res.status(200).json(flowers);
});

//  @route POST /api/flowers
const addFlower = asyncHandler(async (req, res) => {
  const { f_id, name, category, color, price, stock, description, image } =
    req.body;
  // Check if f_id already exists in the database
  const flowerIdExists = await flowerModel.findOne({ f_id });

  if (flowerIdExists){
    res.status(400);
    throw new Error(`The flower with f_id ${f_id} already exists! Choose a different f_id.`);
  }
  const flower = await flowerModel.create(req.body);
  res.status(200).json(flower);
});

//  @route PUT /api/flowers/:id
const updateFlowerById = asyncHandler(async (req, res) => {
  // converting string id to object id since that is the datatype in mongodb
  const objectId = new mongoose.Types.ObjectId(req.params.id);
  const flower = await flowerModel.findById(objectId);
  // if id not found in the db
  if (!flower) {
    res.status(400);
    throw new Error(`The flower with id ${objectId} doesn't exist!`);
  }

  const updatedFlower = await flowerModel.findByIdAndUpdate(
    objectId,
    req.body,
    { new: true }
  ); //new:true will return the data after the update
  res.status(200).json(updatedFlower);
});

//  @route DELETE /api/flowers/:id
const deleteFlowerById = asyncHandler(async (req, res) => {
  // converting string id to object id since that is the datatype in mongodb
  const objectId = new mongoose.Types.ObjectId(req.params.id);
  const flower = await flowerModel.findById(objectId);
  // if id not found in the db
  if (!flower) {
    res.status(400);
    throw new Error(`The flower with id ${objectId} doesn't exist!`);
  }

  const deletedFlower = await flowerModel.findByIdAndDelete(objectId); //new:true will return the data after the update
  res.status(200).json(deletedFlower);
});

module.exports = { getFlowers, addFlower, updateFlowerById, deleteFlowerById };
