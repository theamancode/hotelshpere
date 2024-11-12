const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const {createHotleSphereTables} = require('./models/tableCreations');
const userRouters = require('./routes/usersRoutes');
const hotelRouters = require('./routes/hotelsRoutes');
// Initialize the App
const app = express();

dotenv.config();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('<h1>Comming Soon HotelSphere!</h1>')
})

// Call the function to Create Table
createHotleSphereTables();

// Define all Routes here
app.use('/api/users', userRouters);
app.use('/api/hotels', hotelRouters);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is runing on PORT ${PORT}`);
})