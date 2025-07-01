import React, { useState, useEffect } from 'react'
import { Copy, RefreshCw, Users, Key, CheckCircle, ArrowLeft, Clock, Shield } from 'lucide-react'
import { Header } from '../../Layouts/Header/Header'
import { SidebarInmobiliaria } from '../../Layouts/SidebarInmobiliaria/SidebarInmobiliaria'

export const GenerarTokenAgente = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [tokenActual, setTokenActual] = useState('')
  const [tokenCopiado, setTokenCopiado] = useState(false)
  const [tokensGenerados, setTokensGenerados] = useState([])
  const [nombreAgente, setNombreAgente] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  // Función para generar token único
  const generarToken = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let token = ''
    for (let i = 0; i < 32; i++) {
      token += caracteres.charAt(Math.floor(Math.random() * caracteres.length))
    }
    return `AGT_${token}`
  }

  // Función para generar nuevo token
  const handleGenerarToken = () => {
    if (!nombreAgente.trim()) {
      alert('Por favor, ingresa el nombre del agente')
      return
    }

    setIsGenerating(true)
    
    // Simular proceso de generación
    setTimeout(() => {
      const nuevoToken = generarToken()
      setTokenActual(nuevoToken)
      
      // Agregar a la lista de tokens generados
      const nuevoTokenObj = {
        id: Date.now(),
        token: nuevoToken,
        nombreAgente: nombreAgente,
        fechaCreacion: new Date(),
        usado: false,
        fechaExpiracion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
      }
      
      setTokensGenerados(prev => [nuevoTokenObj, ...prev])
      setNombreAgente('')
      setIsGenerating(false)
      setTokenCopiado(false)
    }, 1500)
  }

  // Función para copiar token
  const copiarToken = (token) => {
    navigator.clipboard.writeText(token)
    setTokenCopiado(true)
    setTimeout(() => setTokenCopiado(false), 2000)
  }

  // Función para manejar toggle del sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Función para manejar logout
  const handleLogout = () => {
    console.log('Cerrando sesión...')
    setIsAuthenticated(false)
  }

  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    return fecha.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Función para verificar si el token está expirado
  const isTokenExpirado = (fechaExpiracion) => {
    return new Date() > fechaExpiracion
  }

  // Cerrar sidebar al hacer clic fuera en móviles
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />
      
      {/* Layout principal */}
      <div className="flex pt-16">
        {/* Sidebar fijo para desktop */}
        <div className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white shadow-lg border-r border-gray-200 overflow-y-auto z-30">
          <SidebarInmobiliaria 
            isOpen={true}
            toggleMenu={() => {}}
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
            isFixedLayout={true}
          />
        </div>

        {/* Sidebar overlay para móviles */}
        <SidebarInmobiliaria 
          isOpen={isSidebarOpen}
          toggleMenu={toggleSidebar}
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
          isFixedLayout={false}
        />

        {/* Overlay para cerrar sidebar en móviles */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-white bg-opacity-70 z-40 lg:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Contenido principal */}
        <main className="flex-1 lg:ml-72 transition-all duration-300">
          <div className="p-4 sm:p-6 max-w-6xl mx-auto">
            {/* Header de la página */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-4 mb-4">
                <button 
                  onClick={() => window.history.back()}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Generar Token de Agente</h1>
                  <p className="text-gray-600 text-sm mt-1">
                    Crea tokens únicos para que los agentes se registren en tu inmobiliaria
                  </p>
                </div>
              </div>
            </div>

            {/* Formulario de generación */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center gap-2 mb-6">
                <Key className="w-6 h-6 text-[#2F8EAC]" />
                <h2 className="text-xl font-semibold text-gray-900">Generar Nuevo Token</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Formulario */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Agente
                    </label>
                    <input
                      type="text"
                      value={nombreAgente}
                      onChange={(e) => setNombreAgente(e.target.value)}
                      placeholder="Ej: Juan Pérez"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                    />
                  </div>

                  <button
                    onClick={handleGenerarToken}
                    disabled={isGenerating || !nombreAgente.trim()}
                    className="w-full bg-[#2F8EAC] text-white px-6 py-3 rounded-xl hover:bg-[#267a95] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Generando Token...
                      </>
                    ) : (
                      <>
                        <Key className="w-5 h-5" />
                        Generar Token
                      </>
                    )}
                  </button>
                </div>

                {/* Token generado */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Token Generado
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={tokenActual}
                        readOnly
                        placeholder="El token aparecerá aquí..."
                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl bg-gray-50 font-mono text-sm"
                      />
                      {tokenActual && (
                        <button
                          onClick={() => copiarToken(tokenActual)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          {tokenCopiado ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <Copy className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {tokenActual && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Información del Token</span>
                      </div>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• El token expira en 7 días</li>
                        <li>• Solo puede ser usado una vez</li>
                        <li>• Compártelo de forma segura con el agente</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Lista de tokens generados */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-[#2F8EAC]" />
                  <h2 className="text-xl font-semibold text-gray-900">Tokens Generados</h2>
                </div>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                  {tokensGenerados.length} tokens
                </span>
              </div>

              {tokensGenerados.length === 0 ? (
                <div className="text-center py-12">
                  <Key className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No hay tokens generados aún</p>
                  <p className="text-sm text-gray-400">Genera tu primer token para comenzar</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tokensGenerados.map((tokenObj) => (
                    <div key={tokenObj.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-gray-900">{tokenObj.nombreAgente}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              tokenObj.usado 
                                ? 'bg-green-100 text-green-700' 
                                : isTokenExpirado(tokenObj.fechaExpiracion)
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {tokenObj.usado ? 'Usado' : isTokenExpirado(tokenObj.fechaExpiracion) ? 'Expirado' : 'Activo'}
                            </span>
                          </div>
                          <p className="font-mono text-sm text-gray-600 mb-2">{tokenObj.token}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Creado: {formatearFecha(tokenObj.fechaCreacion)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Expira: {formatearFecha(tokenObj.fechaExpiracion)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copiarToken(tokenObj.token)}
                            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
                          >
                            <Copy className="w-4 h-4" />
                            Copiar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}