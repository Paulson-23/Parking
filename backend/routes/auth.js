// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const Parking = require('../models/Parking');

// // POST /login
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user || user.password !== password) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }

//     res.json({ message: 'Login successful', user: { id: user._id, email: user.email } });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });

// router.post('/parking', async (req, res) => {
//   const { vehicleNumber } = req.body;
  
//   try {
//     // 1. Check if the vehicle is already parked
//     const existingRecord = await Parking.findOne({ vehicleNumber });
//     if (existingRecord) {
//       return res.json({
//         userSlot: existingRecord.slotNumber,
//         occupied: (await Parking.find({ isOccupied: true })).map(s => s.slotNumber),
//       });
//     }

//     // 2. Find all occupied slots
//     const occupiedSlots = await Parking.find({ isOccupied: true }).select('slotNumber');
//     const occupiedSlotNumbers = occupiedSlots.map(slot => slot.slotNumber);

//     // 3. Find the nearest available slot (smallest number not occupied)
//     let allocatedSlot = null;
//     for (let i = 1; i <= 10; i++) {
//       if (!occupiedSlotNumbers.includes(i)) {
//         allocatedSlot = i;
//         break;
//       }
//     }

//     // 4. If no slots available, respond accordingly
//     if (!allocatedSlot) {
//       return res.json({
//         userSlot: null,
//         occupied: occupiedSlotNumbers,
//         message: 'No slots available',
//       });
//     }

//     // 5. Create a new parking record
//     const newParking = new Parking({
//       vehicleNumber,
//       slotNumber: allocatedSlot,
//       isOccupied: true,
//     });
//     await newParking.save();

//     // 6. Send response
//     res.json({
//       userSlot: allocatedSlot,
//       occupied: [...occupiedSlotNumbers, allocatedSlot],
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });




// module.exports = router;
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

// POST /parking
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

// PUT /parking/reset - Sets all isOccupied fields to false
router.put('/parking/reset', async (req, res) => {
  try {
    await Parking.updateMany({}, { $set: { isOccupied: false } });
    res.json({ message: 'All records reset to unoccupied.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /parking/:vehicleNumber (Set isOccupied to false)
router.delete('/parking/:vehicleNumber', async (req, res) => {
  try {
    const vehicleNumber = req.params.vehicleNumber.toUpperCase();
    
    // Find the parking record
    const parkingRecord = await Parking.findOne({ vehicleNumber });

    if (parkingRecord) {
      // Update the isOccupied field to false
      parkingRecord.isOccupied = false;
      await parkingRecord.save();

      res.status(200).json({ message: 'Vehicle record marked as unoccupied successfully' });
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
