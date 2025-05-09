import { useState } from 'react';
import axios from 'axios';


const ParkingPage = () => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [userSlot, setUserSlot] = useState(null);
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  const [showSlots, setShowSlots] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await axios.post('https://parking-fufa.onrender.com/parking', {
        vehicleNumber,
      });

      if (res.data.userSlot !== null) {
        const userSlotFromServer = res.data.userSlot;
        const occupiedSlotsFromServer = res.data.occupied.filter(
          (slot) => slot !== userSlotFromServer
        );

        setUserSlot(userSlotFromServer);
        setOccupiedSlots(occupiedSlotsFromServer);
        setShowSlots(true);
        setError('');
      } else {
        setShowSlots(false);
        setError('No slots available.');
      }
    } catch (err) {
      console.error(err);
      setError('Server error');
    }
  };

  const renderSlots = () => {
    const slots = [];
    for (let i = 1; i <= 10; i++) {
      let slotClass =
        'w-16 h-16 flex items-center justify-center rounded-xl border text-sm font-medium transition-colors duration-200 ';

      if (userSlot === i) {
        slotClass += 'bg-green-600 text-white shadow-lg';
      } else if (occupiedSlots.includes(i)) {
        slotClass += 'bg-red-400 text-white';
      } else {
        slotClass += 'bg-gray-500 text-white border-gray-300';
      }

      slots.push(
        <div key={i} className={slotClass}>
          {i}
        </div>
      );
    }

    return (
      <div className="flex flex-col md:flex-row sm:flex-row justify-center gap-6 mt-8">
        <div className="flex flex-col gap-4">{slots.slice(0, 5)}</div>
        <div className="flex flex-col gap-4">{slots.slice(5, 10)}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full shadow-xl border rounded-2xl p-8 bg-gray-50">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Parking Slot Allocation
        </h1>

        <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
          <input
            type="text"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            placeholder="Enter Vehicle Number"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Search
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-3">{error}</p>
        )}

        {showSlots && renderSlots()}
      </div>
    </div>
  );
};

export default ParkingPage;
