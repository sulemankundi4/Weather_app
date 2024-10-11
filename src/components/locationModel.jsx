import React from 'react';

const LocationModal = ({ onAccept, onDecline }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
        <h2 className="text-2xl font-semibold mb-4">Location Permission</h2>
        <p className="mb-6">We need your location to show the weather information for your area. Please allow us to access your location.</p>
        <div className="flex justify-end">
          <button onClick={onDecline} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Decline</button>
          <button onClick={onAccept} className="bg-blue-500 text-white px-4 py-2 rounded">Accept</button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;