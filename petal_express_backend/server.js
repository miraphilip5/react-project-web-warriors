const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const server_port = process.env.SERVER_PORT || 8080;
const connectDB = require('./config/db.js')

connectDB();
const app = express()

// parse JSON data sent in the request body (for example in a post request)
app.use(express.json())
// parse URL-encoded data sent in the request body (for example in a post request)
app.use(express.urlencoded({extended:false}));

// enable cors (security mechanism which prevents (by default) cross-origin HTTP requests)
app.use(cors());

// api to display the routes for flowers
app.use('/api/flowers', require('./routes/flowerRoutes.js'))

// api to register a user
app.use('/api/user', require('./routes/userRoute'));

// apis - authenticate a user while login, get logged in user details
app.use('/api/auth', require('./routes/authRoutes'));

// api to display the routes for carts
app.use('/api/carts', require('./routes/cartRoutes.js'))

app.listen(server_port,()=>{console.log(`Server listening to port ${server_port}`)})