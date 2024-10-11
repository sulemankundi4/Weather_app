import { useState, useEffect } from 'react';
import LandingPage from './pages/landingPage';
import LocationModal from './components/locationModel';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);

  useEffect(() => {
    const locationPermission = localStorage.getItem('locationPermission');
    if (locationPermission === 'granted') {
      setLocationGranted(true);
      getLocation();
    } else {
      setShowModal(true);
    }
  }, []);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationGranted(true);
          setShowModal(false);
          // Fetch weather data based on position.coords.latitude and position.coords.longitude
        },
        (error) => {
          console.error("Error getting user's location:", error);
          setShowModal(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setShowModal(false);
    }
  };

  const handleAccept = () => {
    localStorage.setItem('locationPermission', 'granted');
    getLocation();
  };

  const handleDecline = () => {
    localStorage.setItem('locationPermission', 'declined');
    setShowModal(false);
  };

  return (
    <>
      {showModal && <LocationModal onAccept={handleAccept} onDecline={handleDecline} />}
      {locationGranted && (
        <div className="min-h-screen bg-black/[0.96]">
          <LandingPage />
        </div>
      )}
    </>
  );
}

export default App;