const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());


mongoose.connect(process.env.MONGO_URI, {})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Use auth routes
app.use('/', authRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// const Parking = require('./models/Parking');

// app.post('/find-vehicle', async (req, res) => {
//   const { vehicleNumber } = req.body;
//   try {
//     const userSlot = await Parking.findOne({ vehicleNumber });
//     const occupiedSlots = await Parking.find({ isOccupied: true });

//     res.json({
//       userSlot: userSlot?.slotNumber || null,
//       occupied: occupiedSlots.map(s => s.slotNumber),
//     });
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });
