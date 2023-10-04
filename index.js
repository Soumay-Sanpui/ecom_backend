const express = require('express');
// const mongoose = require('mongoose');
const connectToMongoose = require('./db/conn');
const userRoutes = require('./routes/userRoute'); // Import the user routes
const orderRoutes = require('./routes/orderRoute'); // Import the order routes

const app = express();
const port = 3000;

// Middleware for parsing JSON requests
app.use(express.json());

// Connect to MongoDB using the connectToMongoose function
connectToMongoose();

// Use the user routes under the '/api/users' prefix
app.use('/api/users', userRoutes);

// Use the order routes under the '/api/orders' prefix
app.use('/api/orders', orderRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
