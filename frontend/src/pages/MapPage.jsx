import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import L from 'leaflet';

// Konum değişikliğini takip eden bileşen
function LocationMarker({ onLocationFound }) {
  const map = useMap();
  const [position, setPosition] = useState(null);
  const locationFoundRef = useRef(false);
  
  useEffect(() => {
    // Konum daha önce bulunduysa tekrar aramayı engelle
    if (locationFoundRef.current) return;
    
    map.locate({ setView: true, maxZoom: 15 });
    
    const handleLocationFound = (e) => {
      setPosition(e.latlng);
      locationFoundRef.current = true; // Konum bulundu işareti
      if (onLocationFound) {
        onLocationFound(e.latlng);
      }
    };
    
    const handleLocationError = (e) => {
      console.error('Konum alınamadı:', e.message);
      alert('Konumunuz alınamadı. Lütfen konum erişimine izin verdiğinizden emin olun.');
    };
    
    map.on('locationfound', handleLocationFound);
    map.on('locationerror', handleLocationError);
    
    return () => {
      map.off('locationfound', handleLocationFound);
      map.off('locationerror', handleLocationError);
    };
  }, [map, onLocationFound]);
  
  return position === null ? null : (
    <Marker 
      position={position}
      icon={L.divIcon({
        className: 'current-location-marker',
        html: '<div class="pulse"></div>',
        iconSize: [20, 20]
      })}
    >
      <Popup>Konumunuz</Popup>
    </Marker>
  );
}

function MapPage() {
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [placeType, setPlaceType] = useState('library');
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);
  
  // Kullanıcı konumu bulunduğunda çağrılacak fonksiyon
  const handleLocationFound = (latlng) => {
    setUserLocation(latlng);
    fetchNearbyPlaces(latlng.lat, latlng.lng, placeType);
  };
  
  // Yakındaki mekanları getir - kullanıcı konumu çevresinde 5 km yarıçapında
  const fetchNearbyPlaces = async (lat, lon, type, radius = 5000) => {
    // İstek devam ediyorsa ve önceki istek 2 saniyeden daha yeni ise, yeni istek yapma
    if (loading) return;
    
    try {
      setLoading(true);
      console.log('API isteği yapılıyor:', { lat, lon, radius, type });
      
      // Özel arama sorgusu oluştur - konum + tür + yakınlık
      // Örnek: "cafe near [lat,lon]" veya "library near [lat,lon]"
      const searchQuery = `${type} near [${lat},${lon}]`;
      
      // API çağrısı - arama sorgusu ve viewbox parametreleri ile
      // viewbox parametresi, belirli bir coğrafi alanla sınırlandırma sağlar
      const response = await axios.get(`http://localhost:5000/api/nominatim/search`, {
        params: { 
          q: searchQuery,
          // Yaklaşık 5km'lik bir viewbox oluştur (0.045 derece ≈ 5km)
          viewbox: `${lon-0.045},${lat-0.045},${lon+0.045},${lat+0.045}`,
          bounded: 1, // Aramaları viewbox ile sınırlandır
          limit: 20 // Sonuç sayısını sınırla
        }
      });
      
      console.log('API yanıtı:', response.data);
      
      // Yanıt boş veya geçersizse
      if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
        console.warn('API yanıtı boş veya geçersiz:', response.data);
        alert(`${type} türünde yakında mekan bulunamadı. Lütfen başka bir mekan türü seçin.`);
        setResults([]);
        setLoading(false);
        return;
      }
      
      // Sonuçları mesafeye göre filtrele - sadece gerçekten yakın olanları göster
      const filteredResults = response.data.filter(item => {
        // Koordinatlar arasındaki mesafeyi hesapla (Haversine formülü)
        const R = 6371; // Dünya yarıçapı (km)
        const dLat = (item.lat - lat) * Math.PI / 180;
        const dLon = (item.lon - lon) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat * Math.PI / 180) * Math.cos(item.lat * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        const distance = R * c; // Kilometre cinsinden mesafe
        
        // Sadece 5 km'den yakın sonuçları kabul et
        return distance <= 5;
      });
      
      console.log('Filtrelenmiş sonuçlar:', filteredResults);
      
      if (filteredResults.length === 0) {
        alert(`${type} türünde yakında mekan bulunamadı. Lütfen başka bir mekan türü seçin.`);
        setResults([]);
        setLoading(false);
        return;
      }
      
      // Filtrelenmiş sonuçları kullan
      setResults(filteredResults);
      
      // Haritayı kullanıcı konumuna odakla ve uygun zoom seviyesini ayarla
      if (mapRef.current) {
        mapRef.current.setView([lat, lon], 14); // 14 zoom seviyesi yaklaşık 5 km yarıçapını gösterir
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Yakındaki mekanlar getirilemedi:', error);
      alert('Yakındaki mekanlar getirilemedi. Lütfen tekrar deneyin.');
      setResults([]);
      setLoading(false);
    }
  };

  // Arama işlemi
  const handleSearch = async () => {
    if (!searchText.trim()) {
      alert('Lütfen bir arama terimi girin');
      return;
    }
    
    try {
      setLoading(true);
      
      // Arama sorgusu - metin araması
      const response = await axios.get(`http://localhost:5000/api/nominatim/search`, {
        params: { 
          q: searchText,
          limit: 1 // Sadece ilk sonucu al
        }
      });
      
      console.log('Konum arama sonucu:', response.data);
      
      // Konum bulunamadıysa
      if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
        alert('Aradığınız konum bulunamadı. Lütfen başka bir konum deneyin.');
        setLoading(false);
        return;
      }
      
      // İlk sonucu al ve haritayı odakla
      const location = response.data[0];
      const lat = parseFloat(location.lat);
      const lon = parseFloat(location.lon);
      
      // Bulunan konumu kullanıcı konumu olarak ayarla
      setUserLocation({ lat, lng: lon });
      
      // Bu konumun çevresindeki mekanları getir
      fetchNearbyPlaces(lat, lon, placeType);
      
      // Haritayı bu konuma odakla
      if (mapRef.current) {
        mapRef.current.setView([lat, lon], 14);
      }
      
    } catch (error) {
      console.error('Arama hatası:', error);
      alert('Arama sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      setLoading(false);
    }
  };

  // Mekan türünü değiştirdiğimizde yakındaki mekanları yeniden getir
  const handlePlaceTypeChange = (type) => {
    setPlaceType(type);
    if (userLocation) {
      fetchNearbyPlaces(userLocation.lat, userLocation.lng, type);
    }
  };
  
  // Konumu yenile
  const handleRefreshLocation = () => {
    if (mapRef.current) {
      setLoading(true);
      // LocationMarker bileşenindeki ref'i sıfırlamak için bir yöntem olmadığından
      // doğrudan burada konum alıp işliyoruz
      mapRef.current.locate({ setView: true, maxZoom: 15 });
      
      // Mevcut event listener'ları temizle
      mapRef.current.off('locationfound');
      mapRef.current.off('locationerror');
      
      // Yeni event listener'ları ekle
      mapRef.current.on('locationfound', (e) => {
        setUserLocation(e.latlng);
        fetchNearbyPlaces(e.latlng.lat, e.latlng.lng, placeType);
        setLoading(false);
      });
      
      mapRef.current.on('locationerror', (e) => {
        console.error('Konum alınamadı:', e.message);
        alert('Konumunuz alınamadı. Lütfen konum erişimine izin verdiğinizden emin olun.');
        setLoading(false);
      });
    }
  };
  
  // Harita referansını kaydet
  const setMapRef = (map) => {
    mapRef.current = map;
  };

  // Marker için özel ikon oluştur
  const getMarkerIcon = (type) => {
    let iconUrl = '/marker-icon.png'; // Varsayılan
    
    if (type === 'library') {
      iconUrl = '/library-icon.png';
    } else if (type === 'cafe') {
      iconUrl = '/cafe-icon.png';
    } else if (type === 'study') {
      iconUrl = '/study-icon.png';
    }
    
    return L.icon({
      iconUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">Çalışma Alanları Haritası</h1>
      
      {/* Arama ve Filtreler */}
      <div className="mb-4 flex flex-col md:flex-row gap-4">
        <div className="flex flex-1">
        <input
          type="text"
          placeholder="Konum ara..."
          className="flex-1 p-2 border border-gray-600 rounded-l bg-gray-800 text-white placeholder-gray-400"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Aranıyor...' : 'Ara'}
          </button>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleRefreshLocation}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center gap-2"
            title="Konumumu Bul"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Konumum
          </button>
        </div>
      </div>
      
      {/* Mekan Türü Filtreleri */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button 
          onClick={() => handlePlaceTypeChange('library')}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${placeType === 'library' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          Kütüphaneler
        </button>
        <button 
          onClick={() => handlePlaceTypeChange('cafe')}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${placeType === 'cafe' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          Kafeler
        </button>
        <button 
          onClick={() => handlePlaceTypeChange('study cafe')}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${placeType === 'study cafe' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          Çalışma Kafeleri
        </button>
        <button 
          onClick={() => handlePlaceTypeChange('coworking')}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${placeType === 'coworking' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          Ortak Çalışma Alanları
        </button>
      </div>
      
      {/* Sonuç Bilgisi */}
      {loading ? (
        <div className="mb-4 text-gray-300">Yükleniyor...</div>
      ) : results.length > 0 ? (
        <div className="mb-4 text-gray-300">
          {results.length} mekan bulundu
        </div>
      ) : null}
      
      {/* Harita */}
      <div className="h-[600px] rounded-lg overflow-hidden border border-gray-700 relative">
        <MapContainer
          center={[39.9334, 32.8597]} // Türkiye'nin merkezi
          zoom={6}
          style={{ height: '100%', width: '100%' }}
          whenCreated={setMapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Kullanıcı konumu */}
          <LocationMarker onLocationFound={handleLocationFound} />
          
          {/* Sonuçlar */}
          {results && results.length > 0 && results.map((item) => {
            // Konum verilerini kontrol et
            if (!item.lat || !item.lon) {
              console.warn('Geçersiz konum verisi:', item);
              return null;
            }
            
            // Konsola mekan bilgilerini yazdır (debug için)
            console.log('Mekan:', {
              id: item.place_id || item.osm_id,
              name: item.name || item.display_name,
              lat: item.lat,
              lon: item.lon
            });
            
            return (
              <Marker
                key={item.place_id || item.osm_id || Math.random().toString()}
                position={[parseFloat(item.lat), parseFloat(item.lon)]}
                icon={L.icon({
                  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
                  shadowSize: [41, 41]
                })}
              >
                <Popup>
                  <div>
                    <h3 className="font-bold">{item.name || item.display_name}</h3>
                    {item.address && (
                      <p className="text-sm mt-1">
                        {item.address.road || ''} {item.address.house_number || ''}, {item.address.city || ''}
                      </p>
                    )}
                    {item.type && <p className="text-xs mt-1">Tür: {item.type}</p>}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
        
        {/* Yükleniyor göstergesi */}
        {loading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 p-4 rounded-lg">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white mx-auto"></div>
            <p className="text-white mt-2">Mekanlar yükleniyor...</p>
          </div>
        )}
      </div>
      
      {/* CSS - Global style */}
      <style dangerouslySetInnerHTML={{__html: `
        .current-location-marker {
          background: transparent;
        }
        .pulse {
          width: 20px;
          height: 20px;
          background-color: #3b82f6;
          border-radius: 50%;
          box-shadow: 0 0 0 rgba(59, 130, 246, 0.4);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }
      `}} />
    </div>
  );
}

export default MapPage;