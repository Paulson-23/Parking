const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Parking = require('../models/Parking');

// POST /login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.json({ message: 'Login successful', user: { id: user._id, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.post('/parking', async (req, res) => {
  const { vehicleNumber } = req.body;
  
  try {
    // 1. Check if the vehicle is already parked
    const existingRecord = await Parking.findOne({ vehicleNumber });
    if (existingRecord) {
      return res.json({
        userSlot: existingRecord.slotNumber,
        occupied: (await Parking.find({ isOccupied: true })).map(s => s.slotNumber),
      });
    }

    // 2. Find all occupied slots
    const occupiedSlots = await Parking.find({ isOccupied: true }).select('slotNumber');
    const occupiedSlotNumbers = occupiedSlots.map(slot => slot.slotNumber);

    // 3. Find the nearest available slot (smallest number not occupied)
    let allocatedSlot = null;
    for (let i = 1; i <= 10; i++) {
      if (!occupiedSlotNumbers.includes(i)) {
        allocatedSlot = i;
        break;
      }
    }

    // 4. If no slots available, respond accordingly
    if (!allocatedSlot) {
      return res.json({
        userSlot: null,
        occupied: occupiedSlotNumbers,
        message: 'No slots available',
      });
    }

    // 5. Create a new parking record
    const newParking = new Parking({
      vehicleNumber,
      slotNumber: allocatedSlot,
      isOccupied: true,
    });
    await newParking.save();

    // 6. Send response
    res.json({
      userSlot: allocatedSlot,
      occupied: [...occupiedSlotNumbers, allocatedSlot],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});




module.exports = router;