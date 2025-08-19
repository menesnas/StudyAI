import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useState } from 'react';
import axios from 'axios';

function MapPage() {
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/nominatim/search?q=${searchText}`);
      setResults(response.data);
    } catch (error) {
      console.error('Arama hatası:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">Çalışma Alanları Haritası</h1>
      <div className="mb-4 flex">
        <input
          type="text"
          placeholder="Konum ara..."
          className="flex-1 p-2 border border-gray-600 rounded-l bg-gray-800 text-white placeholder-gray-400"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
        >
          Ara
        </button>
      </div>
      <div className="h-[600px] rounded-lg overflow-hidden border border-gray-700">
        <MapContainer
          center={[39.9334, 32.8597]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {results.map((item) => (
            <Marker
              key={item.place_id}
              position={[parseFloat(item.lat), parseFloat(item.lon)]}
            >
              <Popup>{item.display_name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default MapPage;