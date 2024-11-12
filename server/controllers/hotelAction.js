const db = require('../config/db');
const globalDbAction = require('../models/globalDbAction');
const hotelDbAction = require('../models/hotelDbAction');

const hotelAction = {
    // Register Hotel
    registerHotel: (req, res) => {
        const hotelData = req.body;
        hotelDbAction.registerHotel(hotelData, (err, result) => {
            if (err) {
                res.status(500).json({error: err});
            } else {
                res.status(200).json({result: result});
            }
        });
    },

    // Get Hotel Details
    getHotels: (req, res) => {
        hotelDbAction.getHotelsDetails((err, result) => {
            if (err) {
                res.status(500).json({error: err});
            } else {
                res.status(200).json({result: result});
            }
        })
    },

    // Get Single Hotel Detail
    getHotel: (req, res) => {
        const hotelId = req.params.hotel_id;
        hotelDbAction.getHotelDetails(hotelId, (err, result) => {
            if(err) {
                res.status(500).json({error: err});
            } else {
                res.status(200).json({result: result});
            }
        });
    },

    // Update Hotel Details
    updateHotel: (req, res) => {
        const hotelId = req.params.hotel_id;
        const hotelData = req.body;
        hotelDbAction.updateHotelDetails(hotelId, hotelData, (err, result) => {
            if (err) {
                res.status(500).json({error: err});
            } else {
                res.status(200).json({result: result});
            }
        });
    },

    // Delete Hotel Data
    deleteHotel: (req, res) => {
        const hotelId = req.params.hotel_id;  // Hotel ID from URL parameters
        hotelDbAction.deleteHotel(hotelId, (err, result) => {
            if (err) {
                return res.status(500).json({error: err });
            }
            return res.status(200).json(result);
        });
    }
}
module.exports = hotelAction;