const db = require("../config/db");
const globalDbAction = require("./globalDbAction");

// Create and Update the Hotel information
const hotelDbAction = {
    // Register hotel
    registerHotel: (hotelData, callback) => {
        const checkHotelSql = `SELECT * FROM hs_hotel_registrations WHERE email = ?`;
        db.query(checkHotelSql, [hotelData.email], (checkErr, checkResult) => {
            if (checkErr) {
                console.error("Error checking user existence: ", checkErr);
                return callback(checkErr, null);  // Send the error to the controller
            }

            if (checkResult.length > 0) {
                // Hotel with this email already exists
                return callback({ success: false, message: "Hotel with this email already exists" }, null);
            } else {
                // If email does not exist, proceed to insert hotel data
                const insertHotelSql = `INSERT INTO hs_hotel_registrations 
                (name, owner_name, email, phone_number, address, latitude, longitude, city_id, state, country, postal_code, star_rating, check_in_time, check_out_time, status, description, logo_url, registration_date, verified, tax_id, reviews_count, average_review_rating)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                db.query(insertHotelSql, [
                    hotelData.name, hotelData.owner_name, hotelData.email, hotelData.phone_number, hotelData.address, hotelData.latitude, hotelData.longitude, hotelData.city_id, hotelData.state, hotelData.country, hotelData.postal_code, hotelData.star_rating, hotelData.check_in_time, hotelData.check_out_time, hotelData.status, hotelData.description, hotelData.logo_url, hotelData.registration_date, hotelData.verified, hotelData.tax_id, hotelData.reviews_count, hotelData.average_review_rating
                ], (insertErr, hotelResult) => {
                    if (insertErr) {
                        console.error("Error registering hotel: ", insertErr);
                        return callback(insertErr, null);
                    }

                    const hotelId = hotelResult.insertId;
                    
                    // Step 2: Insert Amenities
                    const amenities = JSON.stringify(hotelData.amenities);

                    const insertAmenitiesSql = `INSERT INTO hs_hotel_amenities (hotel_id, amenities) VALUES (?, ?)`;
                    db.query(insertAmenitiesSql, [hotelId, amenities], (amenitiesErr) => {
                        if (amenitiesErr) {
                            console.error("Error inserting hotel amenities: ", amenitiesErr);
                            return callback(amenitiesErr, null);
                        }

                        // Step 3: Insert Room Types
                        const roomTypes = JSON.stringify(hotelData.room_types);
                        const insertRoomsSql = `INSERT INTO hs_hotel_room_types (hotel_id, room_data) VALUES (?, ?)`;
                        db.query(insertRoomsSql, [hotelId, roomTypes], (roomsErr) => {
                            if (roomsErr) {
                                console.error("Error inserting hotel rooms: ", roomsErr);
                                return callback(roomsErr, null);
                            }
                            return callback(null, { success: true, message: "Hotel registered successfully", hotelId });
                        });
                    });
                });
            }
        });
    },

    // Get Hotels with all details
    getHotelsDetails: (callback) => {
        const getHotelsSql = 'SELECT hr.*, ha.*, rt.* FROM hs_hotel_registrations hr LEFT JOIN hs_hotel_amenities ha ON hr.hotel_id = ha.hotel_id LEFT JOIN hs_hotel_room_types rt ON hr.hotel_id = rt.hotel_id';
        db.query(getHotelsSql, (checkErr, response) => {
            if (checkErr) {
                console.log("Error in fetching hotel details: ", checkErr);
                return callback(checkErr, null);
            }
            if (response.length === 0) {
                return callback(null, { success: true, message: "No hotel found", hotelData: response });    
            }

            // Parse the JSON fields for amenities and room_type in each hotel record
            const parsedResponse = response.map(hotel=>{
                if (hotel.amenities) {
                    try {
                        hotel.amenities = JSON.parse(hotel.amenities);
                    } catch(e){
                        console.log("Error Parsing amenities JSON: ", e);
                    }
                }

                if (hotel.room_data) {
                    try {
                        hotel.room_data = JSON.parse(hotel.room_data);
                    } catch(e) {
                        console.log("Error parsing room data JSON: ", e);
                    }
                }
                return hotel;
            })

            return callback(null, { success: true, message: "All hotel fetched successfully", hotelData: parsedResponse });
        });
    },

    // Get Single Hotel Details
    getHotelDetails: (hotelId, callback) => {
        const getHotelSql = 'SELECT hr.*, ha.*, rt.* FROM hs_hotel_registrations hr LEFT JOIN hs_hotel_amenities ha ON hr.hotel_id = ha.hotel_id LEFT JOIN hs_hotel_room_types rt ON hr.hotel_id = rt.hotel_id WHERE hr.hotel_id ='+hotelId;
        db.query(getHotelSql, (checkErr, response) => {
            if (checkErr) {
                console.log("Error in fetching hotel details: ", checkErr);
                return callback(checkErr, null);
            }
            if (response.length === 0) {
                return callback(null, { success: true, message: "No hotel found", hotelData: response });    
            }

            const parsedResponse = response.map(hotel=> {
                if (hotel.amenities) {
                    try {
                        hotel.amenities = JSON.parse(hotel.amenities);
                    } catch(e){
                        console.log("Error Parsing amenities JSON: ", e);
                    }
                }
                if (hotel.room_data) {
                    try {
                        hotel.room_data = JSON.parse(hotel.room_data);
                    } catch(e){
                        console.log("Error Parsing room_data JSON: ", e);
                    }
                }
            })
            return callback(null, { success: true, message: "Here All details of: "+hotelId, hotelData: response });
        }); 
    },

    // Update Hotel Details
    updateHotelDetails: (hotelId, hotelData, callback) => {
        const checkHotelSql = 'SELECT * FROM hs_hotel_registrations WHERE hotel_id=?';
        db.query(checkHotelSql, [hotelId], (checkErr, checkResult) => {
            if (checkErr) {
                console.log("Error Checking hotel existence: ", checkErr);
                return callback(checkErr, null);
            }

            if (checkResult.length === 0) {
                // Hotel does not exists
                return callback({success: false, message: "Hotel not found"}, null);
            } else {
                // If hotel exist, proceed to update hotel data
                const updateHotelSql = `UPDATE hs_hotel_registrations 
                SET name = ?, owner_name = ?, email = ?, phone_number = ?, address = ?, 
                    latitude = ?, longitude = ?, city_id = ?, state = ?, country = ?, 
                    postal_code = ?, star_rating = ?, check_in_time = ?, check_out_time = ?, 
                    status = ?, description = ?, logo_url = ?, registration_date = ?, 
                    verified = ?, tax_id = ?, reviews_count = ?, average_review_rating = ?
                WHERE hotel_id = ?`;

                db.query(updateHotelSql, [hotelData.name, hotelData.owner_name, hotelData.email, hotelData.phone_number, 
                    hotelData.address, hotelData.latitude, hotelData.longitude, hotelData.city_id, 
                    hotelData.state, hotelData.country, hotelData.postal_code, hotelData.star_rating, 
                    hotelData.check_in_time, hotelData.check_out_time, hotelData.status, hotelData.description, 
                    hotelData.logo_url, hotelData.registration_date, hotelData.verified, hotelData.tax_id, 
                    hotelData.reviews_count, hotelData.average_review_rating, hotelId], (updateErr, result) => {
                        if (updateErr) {
                            console.error("Error updating hotel data: ", updateErr);
                            return callback(updateErr, null);
                        }

                        // Step 2: Update Amenities
                        const amenities = JSON.stringify(hotelData.amenities);
                        const updateAmenitiesSql = `UPDATE hs_hotel_amenities SET amenities = ? WHERE hotel_id = ?`;
                        db.query(updateAmenitiesSql, [amenities, hotelId], (amenitiesErr) => {
                            if (amenitiesErr) {
                                console.error("Error updating hotel amenities: ", amenitiesErr);
                                return callback(amenitiesErr, null);
                            }

                            // Step 3: Update Room Types
                            const roomTypes = JSON.stringify(hotelData.room_types);
                            const updateRoomsSql = `UPDATE hs_hotel_room_types SET room_data = ? WHERE hotel_id = ?`;
                            db.query(updateRoomsSql, [roomTypes, hotelId], (roomsErr) => {
                                if (roomsErr) {
                                    console.error("Error updating hotel rooms: ", roomsErr);
                                    return callback(roomsErr, null);
                                }
                                return callback(null, { success: true, message: "Hotel updated successfully", updatedData: result });
                            });
                        })
                    } 
                )
            }
        });
    },

    // Delete Hotel and Associated Data
    deleteHotel: (hotelId, callback) => {
        // Check if the hotel exists first
        const checkHotelSql = `SELECT * FROM hs_hotel_registrations WHERE hotel_id = ?`;
        db.query(checkHotelSql, [hotelId], (checkErr, checkResult) => {
            if (checkErr) {
                console.error("Error checking hotel existence: ", checkErr);
                return callback(checkErr, null);
            }

            if (checkResult.length === 0) {
                // Hotel does not exist
                return callback({ success: false, message: "Hotel not found" }, null);
            } else {
                // Step 1: Delete Room Types associated with the hotel
                const deleteRoomsSql = `DELETE FROM hs_hotel_room_types WHERE hotel_id = ?`;
                db.query(deleteRoomsSql, [hotelId], (roomsErr) => {
                    if (roomsErr) {
                        console.error("Error deleting hotel rooms: ", roomsErr);
                        return callback(roomsErr, null);
                    }

                    // Step 2: Delete Amenities associated with the hotel
                    const deleteAmenitiesSql = `DELETE FROM hs_hotel_amenities WHERE hotel_id = ?`;
                    db.query(deleteAmenitiesSql, [hotelId], (amenitiesErr) => {
                        if (amenitiesErr) {
                            console.error("Error deleting hotel amenities: ", amenitiesErr);
                            return callback(amenitiesErr, null);
                        }

                        // Step 3: Delete the hotel record itself
                        const deleteHotelSql = `DELETE FROM hs_hotel_registrations WHERE hotel_id = ?`;
                        db.query(deleteHotelSql, [hotelId], (deleteErr) => {
                            if (deleteErr) {
                                console.error("Error deleting hotel: ", deleteErr);
                                return callback(deleteErr, null);
                            }

                            return callback(null, { success: true, message: "Hotel deleted successfully" });
                        });
                    });
                });
            }
        });
    }
}
module.exports = hotelDbAction;