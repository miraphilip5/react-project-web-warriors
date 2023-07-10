const mongoose = require("mongoose");
// since all the api methods are async, we need to use either try-catch or .then structure, to avoid using any of them
// we can alternatively use asyncHandler (simply wrap async in this)
const asyncHandler = require("express-async-handler");
// importing flowerModel (that holds the mongoDB db schema)
const flowerModel = require("../models/flowerModel");
// importing jwt to check if the user is authenticated
const jwt = require("jsonwebtoken");


//Authentication middleware (only allow the access to the apis if the user is authenticated)
const authenticatedUser = asyncHandler(async (req,res,next) => {
  // get jwt from header
  // console.log(req.headers);
  let token = req.headers.authorization;
  console.log("The token at the backend is " + token);

  // to test: login via frontend, get token from console and paste it here and uncomment
  // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ4ZjljZDYwMmQ5MmUwMDg4NzM2YTFhIiwibmFtZSI6IlNpbXRlc3QifSwiaWF0IjoxNjg3MTM5NDMwLCJleHAiOjE2OTQ5MTU0MzB9.9S-1yEEScw_Kmfsc2tw0kJK6MAhXneeB2lzvxo91ycY";
  //if no token i.e. user has not logged in
  if(!token) {
    res.status(400);
    throw new Error(`Not authorized, no token available!`);
  }

  //condition if the user is logged in with correct credentials (i.e. the token is valid)
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
     // Attach the decoded user information to the request object
     req.user = {
      name: decoded.name,
      email: decoded.email
    };
    next();
  }catch(error){
    res.status(401);
    throw new Error(`Not authorized, invalid token!`);
  }
});



// since mongoose methods return a promise, we need to use async for all of these methods
//  @route GET /api/flowers
const getFlowers = [authenticatedUser, asyncHandler(async (req, res) => {
    // Add cache-control headers to prevent caching
    // res.setHeader('Cache-Control', 'no-store');
    // res.setHeader('Expires', '0');
  // set this filter from the parameter later
  const filter = {};
  const flowers = await flowerModel.find().sort({ f_id: 1 }).exec(); // Sort by f_id in ascending order
  res.status(200).json(flowers);
})];

//Kaiyan
//@route GET /api/flowers/:f_id
const getFlowerById = [authenticatedUser,asyncHandler(async (req, res) => {
  const flowerId = req.params.f_id;
  const flower = await flowerModel.findOne({ f_id: flowerId }).exec();

  // if id not found in the db
  if (!flower) {
    res.status(400);
    //throw new Error(`The flower with id ${objectId} doesn't exist!`);
  }
  res.status(200).json(flower);
})];

//  @route POST /api/flowers
const addFlower = [authenticatedUser,asyncHandler(async (req, res) => {
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
})];

//  @route PUT /api/flowers/:id
const updateFlowerById =[authenticatedUser, asyncHandler(async (req, res) => {
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
})];

//  @route DELETE /api/flowers/:id
const deleteFlowerById = [authenticatedUser,asyncHandler(async (req, res) => {
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
})];

module.exports = { getFlowers, addFlower, updateFlowerById, deleteFlowerById, getFlowerById, authenticatedUser };
