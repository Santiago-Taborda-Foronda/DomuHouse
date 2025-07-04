import React, { useState, useEffect } from 'react';
import { Header } from '../../Layouts/Header/Header';
import { RealEstateCard } from '../../../Components/Layouts/RealEstateCard/RealEstateCard';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export const ShowInmobiliarias = () => {
  const [realEstates, setRealEstates] = useState([]);
  const [filteredRealEstates, setFilteredRealEstates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_properties: 0,
    total_real_estates: 0,
    avg_properties_per_real_estate: 0,
  });

  // Obtener datos de la API
  useEffect(() => {
    const fetchRealEstates = async () => {
      try {
        const response = await fetch('http://localhost:10101/api/inmobiliarias/getAllRealEstates');
        if (!response.ok) throw new Error('Error en la respuesta de la red');
        const data = await response.json();
        // Depuración: Verificar los datos devueltos
        data.forEach((re) => console.log('RealEstate Data:', re));
        // Generar logoUrl y propiedades simuladas
      const updatedData = data.map((re) => ({
  ...re,
  adminName: re.admin_name,
  adminLastName: re.admin_lastname,
  logoUrl: re.logo_url || `/uploads/logo_${re.id}.jpg`,
  properties: Array.from({ length: re.num_properties }, (_, index) => ({
    id: `${re.id}_${index + 1}`,
    photoUrl: `/uploads/property_${re.id}_${index + 1}.jpg`,
  })),
}));
        setRealEstates(updatedData);
        setFilteredRealEstates(updatedData);
      } catch (error) {
        setError('No se pudieron cargar las inmobiliarias');
      } finally {
        setLoading(false);
      }
    };
    fetchRealEstates();
  }, []);

  // Filtrar por nombre, ciudad o departamento
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredRealEstates(realEstates);
    } else {
      const filtered = realEstates.filter((re) =>
        re.name_realestate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        re.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        re.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRealEstates(filtered);
    }
  }, [searchTerm, realEstates]);

  // Obtener estadísticas
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:10101/api/inmobiliarias/stats');
        if (!response.ok) throw new Error('Error al obtener estadísticas');
        const data = await response.json();
        setStats({
          total_properties: data.total_properties,
          total_real_estates: data.total_real_estates,
          avg_properties_per_real_estate: Math.round(data.avg_properties_per_real_estate || 0),
        });
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      }
    };
    fetchStats();
  }, []);

  const handleRealEstateClick = (realEstate) => {
    navigate('/inmobiliaria-seleccionada', { state: { realEstate } });
  };

  if (loading) return <div className="text-center mt-10 text-gray-600 text-lg">Cargando inmobiliarias...</div>;
  if (error) return <div className="text-center mt-10 text-red-600 text-lg">{error}</div>;

  return (
    <>
      <Header />
      <div className="px-6 md:px-12 lg:px-24 py-12 bg-gray-50 min-h-screen">
        {/* Título y buscador */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Inmobiliarias Registradas</h1>
          <p className="text-lg text-gray-600 mb-6">Explora las inmobiliarias disponibles en nuestra plataforma</p>

          {/* Buscador */}
          <div className="relative max-w-lg">
            <input
              type="text"
              placeholder="Buscar por nombre, ciudad o departamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 pl-12 bg-white border border-gray-200 rounded-xl shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-500 text-gray-800"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
          </div>
        </div>

        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRealEstates.length === 0 ? (
            <p className="text-center text-gray-600 text-lg col-span-3">No se encontraron inmobiliarias.</p>
          ) : (
            filteredRealEstates.map((realEstate) => (
              <RealEstateCard
                key={realEstate.id}
                name={realEstate.name_realestate}
                address={realEstate.adress}
                city={realEstate.city}
                department={realEstate.department}
                phone={realEstate.phone}
                email={realEstate.email}
                propertyCount={realEstate.num_properties}
                adminName={realEstate.adminName}
                logoUrl={realEstate.logoUrl}
                properties={realEstate.properties}
                onClick={() => handleRealEstateClick(realEstate)}
              />
            ))
          )}
        </div>

        {/* Estadísticas */}
        <div className="mt-16 bg-blue-50 rounded-2xl p-8 shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Estadísticas Generales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-center gap-4">
              <span className="text-3xl font-extrabold text-blue-600">{stats.total_real_estates}</span>
              <p className="text-gray-600">Inmobiliarias</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-center gap-4">
              <span className="text-3xl font-extrabold text-blue-600">{stats.total_properties}</span>
              <p className="text-gray-600">Inmuebles</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-center gap-4">
              <span className="text-3xl font-extrabold text-blue-600">{stats.avg_properties_per_real_estate}</span>
              <p className="text-gray-600">Promedio</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};