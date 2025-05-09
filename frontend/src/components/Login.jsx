import { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [showSlots, setShowSlots] = useState(false); // State to manage showing the slots
  const [slots, setSlots] = useState([]); // To store the slot details

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/login', { email, password });
      if (res.status === 200) {
        setMsg('Login successful ✅');
        // Fetch slots after successful login
        fetchSlots();
      } else {
        setMsg('Invalid credentials ❌');
      }
    } catch (err) {
      setMsg('Server error 😓');
    }
  };

  // Fetch parking slots from the server
  const fetchSlots = async () => {
    try {
      const res = await axios.get('http://localhost:3000/parking');
      if (res.data) {
        setSlots(res.data); // Assuming the response contains an array of slot details
        setShowSlots(true); // Show slots on successful login
      }
    } catch (err) {
      setMsg('Error fetching slots 😓');
    }
  };

  const handleSlotClick = (slotId) => {
    const slot = slots.find((slot) => slot.id === slotId);
    if (slot) {
      alert(`Vehicle ID in Slot ${slotId}: ${slot.vehicleId}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>
        {msg && (
          <p
            className={`mt-4 text-center text-sm ${msg.includes('successful') ? 'text-green-500' : 'text-red-500'}`}
          >
            {msg}
          </p>
        )}
        {showSlots && (
          <div className="mt-6">
            <h3 className="text-2xl text-center text-blue-600 mb-4">Parking Slots</h3>
            <div className="grid grid-cols-2 gap-4">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className="p-4 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300"
                  onClick={() => handleSlotClick(slot.id)}
                >
                  Slot {slot.id}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
