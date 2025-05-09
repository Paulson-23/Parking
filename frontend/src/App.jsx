import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/Login';
import ParkingPage from './Pages/ParkingPage';

function App() {
  return (
    
    <Router>
      <Routes>
      {/* <h2 className="text-3xl text-blue-500 font-bold">Tailwind is Working!</h2> */}
        {/* <Route path="/" element={<LoginPage />} /> */}
        <Route path="/" element={<ParkingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
