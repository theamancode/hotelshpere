const express = require("express");
const hotelRouter = express.Router();
const hotelAction = require('../controllers/hotelAction');

// Regsiter Hotel Route
hotelRouter.post('/register-hotel', hotelAction.registerHotel);

// Get Hotel Details
hotelRouter.get('/get-hotels', hotelAction.getHotels);

// Get Single Hotel Detail
hotelRouter.post('/get-hotel/:hotel_id', hotelAction.getHotel);

// Update Hotel Details
hotelRouter.put('/update-hotel-details/:hotel_id', hotelAction.updateHotel);

// Delete Hotel
hotelRouter.delete('/delete-hotel/:hotel_id', hotelAction.deleteHotel);

module.exports = hotelRouter;