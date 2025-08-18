import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Marker icon sorunu için çözüm
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Backend API URL
const API_URL = 'http://localhost:5000/api/nominatim';

function NominatimSearch() {
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!searchText) return;

    setLoading(true);
    setResults([]);
    setError(null);

    try {
      const response = await axios.get(`${API_URL}/search`, {
        params: { q: searchText },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      setResults(response.data);
    } catch (err) {
      console.error('API hatası:', err);
      setError('Arama sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>OpenStreetMap Adres Arama</h2>
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Örn: Anıtkabir, Ankara"
          style={{ flex: 1, padding: '10px', fontSize: '16px' }}
        />
        <button 
          onClick={handleSearch} 
          style={{ padding: '10px 15px', fontSize: '16px', marginLeft: '10px' }}
        >
          Ara
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          {error}
        </div>
      )}

      {loading && <p>Yükleniyor...</p>}

      {/* Harita bileşeni */}
      <div style={{ height: '400px', marginTop: '20px' }}>
        <MapContainer
          center={[39.9334, 32.8597]} // Ankara merkezi
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
              <Popup>
                {item.display_name}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {results.map((item) => (
          <li 
            key={item.place_id} 
            style={{ 
              border: '1px solid #ccc', 
              borderRadius: '5px', 
              padding: '15px', 
              marginBottom: '10px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            <strong>{item.display_name}</strong>
            <p style={{ margin: '5px 0 0' }}>
              Enlem: {item.lat}, Boylam: {item.lon}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NominatimSearch;