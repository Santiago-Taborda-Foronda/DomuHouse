import React, { useState, useEffect } from 'react';
import { Header } from '../../Layouts/Header/Header'; // Ajusta la ruta según tu proyecto
import { RealEstateCard } from '../../../Components/Layouts/RealEstateCard/RealEstateCard'; // Ajusta la ruta
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react'; // Necesitas instalar lucide-react: npm install lucide-react

export const ShowInmobiliarias = () => {
  const [realEstates, setRealEstates] = useState([]); // Datos originales de la API
  const [filteredRealEstates, setFilteredRealEstates] = useState([]); // Datos filtrados por búsqueda
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Manejo de errores
  const navigate = useNavigate();
  const [stats, setStats] = useState({
  total_properties: 0,
  total_real_estates: 0,
  avg_properties_per_real_estate: 0
});


  // Obtener datos de la API al cargar el componente
  useEffect(() => {
    const fetchRealEstates = async () => {
      try {
        const response = await fetch('http://localhost:10101/api/inmobiliarias');
        if (!response.ok) {
          throw new Error('Error en la respuesta de la red');
        }
        const data = await response.json();
        setRealEstates(data);
        setFilteredRealEstates(data); // Inicialmente, los datos filtrados son los originales
      } catch (error) {
        setError('No se pudieron cargar las inmobiliarias');
      } finally {
        setLoading(false);
      }
    };
    fetchRealEstates();
  }, []);

  // Filtrar los datos según el término de búsqueda
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredRealEstates(realEstates); // Mostrar todos si no hay búsqueda
    } else {
      const filtered = realEstates.filter(re =>
        re.name.toLowerCase().includes(searchTerm.toLowerCase()) // Filtrar por nombre
      );
      setFilteredRealEstates(filtered);
    }
  }, [searchTerm, realEstates]);

  // Estadisticas Generales
  useEffect(() => {
  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:10101/api/inmobiliarias/stats');
      if (!response.ok) {
        throw new Error('Error al obtener estadísticas');
      }
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


  // Navegar a la página de detalles al hacer clic en una tarjeta
  const handleRealEstateClick = (realEstate) => {
    navigate('/inmobiliaria-seleccionada', { state: { realEstate } });
  };

  // Mostrar mensajes de carga o error si aplica
  if (loading) return <div className="text-center mt-10">Cargando inmobiliarias...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;

  return (
    <>
      <Header />
      <div className="px-6 md:px-10 lg:px-20 py-10">
        {/* Título y buscador */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Inmobiliarias Registradas</h1>
          <p className="text-gray-600 mb-6">Conoce todas las inmobiliarias de nuestra plataforma</p>

          {/* Input del buscador */}
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Buscar por nombre de inmobiliaria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none transition-colors"
            />
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Lista de inmobiliarias en grid de 3 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRealEstates.length === 0 ? (
            <p className="text-center text-gray-600 col-span-3">No se encontraron inmobiliarias.</p>
          ) : (
            filteredRealEstates.map(realEstate => (
              <RealEstateCard
                key={realEstate.id}
                name={realEstate.name}
                address={realEstate.address}
                propertyCount={realEstate.propertyCount}
                administrator={realEstate.administrator}
                logoUrl={realEstate.logoUrl}
                onClick={() => handleRealEstateClick(realEstate)}
              />
            ))
          )}
        </div>

        {/* Estadísticas generales fuera del grid */}
        <div className="mt-12 bg-sky-50 rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="text-2xl font-bold text-sky-600">{stats.total_real_estates}</h3>
              <p className="text-gray-600">Inmobiliarias Registradas</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="text-2xl font-bold text-sky-600">
                {stats.total_properties}
              </h3>
              <p className="text-gray-600">Total de Inmuebles</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="text-2xl font-bold text-sky-600">
                {stats.avg_properties_per_real_estate}
              </h3>
              <p className="text-gray-600">Promedio por Inmobiliaria</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};