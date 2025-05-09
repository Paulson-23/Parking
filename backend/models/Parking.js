const mongoose = require('mongoose');

const ParkingSchema = new mongoose.Schema({
  vehicleNumber: String,
  slotNumber: Number,
  isOccupied: Boolean
});

module.exports = mongoose.model('Parking', ParkingSchema, 'Parking');
