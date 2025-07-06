import React, { useState, useEffect } from 'react'
import { Copy, RefreshCw, Users, Key, CheckCircle, ArrowLeft, Clock, Shield } from 'lucide-react'
import { Header } from '../../Layouts/Header/Header'
import { SidebarInmobiliaria } from '../../Layouts/SidebarInmobiliaria/SidebarInmobiliaria'

// Configuración de la API
const API_BASE_URL = 'https://domuhouse.onrender.com/api'

export const GenerarTokenAgente = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [tokenActual, setTokenActual] = useState('')
  const [tokenCopiado, setTokenCopiado] = useState(false)
  const [tokensGenerados, setTokensGenerados] = useState([])
  const [correoAgente, setCorreoAgente] = useState('')
  const [realEstateId, setRealEstateId] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Función para obtener el token de autenticación
  const getAuthToken = () => {
    return localStorage.getItem('authToken') || ''
  }

  // Función para hacer peticiones HTTP
  const makeRequest = async (url, options = {}) => {
    const authToken = getAuthToken()

    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
        ...options.headers,
      },
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...defaultOptions,
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
    }

    return response.json()
  }

  // Función mejorada para cargar todos los tokens desde la base de datos
  const cargarTokens = async () => {
    try {
      setIsLoading(true)
      setError('')

      console.log('Cargando tokens desde la base de datos...')
      
      // Endpoint para obtener todos los tokens
      const response = await makeRequest('/invitacion/tokens')
      
      console.log('Respuesta del servidor:', response)

      // Verificar que la respuesta tenga datos
      if (!response || (!response.data && !Array.isArray(response))) {
        console.warn('La respuesta no contiene datos de tokens')
        setTokensGenerados([])
        return
      }

      // Determinar si los datos están en response.data o directamente en response
      const tokensData = response.data || response

      // Verificar que tokensData sea un array
      if (!Array.isArray(tokensData)) {
        console.error('Los datos de tokens no son un array:', tokensData)
        setError('Formato de datos inválido recibido del servidor')
        return
      }

      // Mapear y formatear los tokens con manejo robusto de campos
      const tokensFormateados = tokensData.map((token, index) => {
        // Crear fecha de expiración (7 días desde la creación si no existe)
        let fechaCreacion
        try {
          fechaCreacion = new Date(
            token.fechaCreacion || 
            token.fecha_creacion || 
            token.createdAt || 
            token.created_at ||
            Date.now()
          )
        } catch (e) {
          fechaCreacion = new Date()
        }

        let fechaExpiracion
        try {
          fechaExpiracion = token.fechaExpiracion || token.fecha_expiracion
            ? new Date(token.fechaExpiracion || token.fecha_expiracion)
            : new Date(fechaCreacion.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 días después
        } catch (e) {
          fechaExpiracion = new Date(fechaCreacion.getTime() + 7 * 24 * 60 * 60 * 1000)
        }

        return {
          id: token.id || token._id || `token-${index}`,
          token: token.token || '',
          correoAgente: token.correoAgente || token.correo_agente || token.recipient_email || 'Sin correo',
          fechaCreacion: fechaCreacion,
          fechaExpiracion: fechaExpiracion,
          usado: Boolean(token.usado || token.utilizado || token.used || false),
          realEstateId: token.realEstateId || token.real_estate_id || ''
        }
      })

      // Ordenar por fecha de creación (más recientes primero)
      tokensFormateados.sort((a, b) => b.fechaCreacion.getTime() - a.fechaCreacion.getTime())

      setTokensGenerados(tokensFormateados)
      console.log(`Cargados ${tokensFormateados.length} tokens`)

    } catch (error) {
      console.error('Error al cargar tokens:', error)
      setError(`Error al cargar los tokens: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Función para generar nuevo token
  const handleGenerarToken = async () => {
    if (!correoAgente.trim() || !realEstateId.trim()) {
      setError('Por favor, completa todos los campos')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const response = await makeRequest('/invitacion/generar-token', {
        method: 'POST',
        body: JSON.stringify({
          recipient_email: correoAgente.trim(),
          realEstateId: Number(realEstateId)
        }),
      })

      const nuevoTokenObj = {
        id: response.id || Date.now(),
        token: response.token,
        correoAgente: correoAgente.trim(),
        fechaCreacion: new Date(),
        usado: false,
        fechaExpiracion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        realEstateId: Number(realEstateId)
      }

      setTokenActual(response.token)
      // Agregar el nuevo token al inicio de la lista
      setTokensGenerados(prev => [nuevoTokenObj, ...prev])
      setCorreoAgente('')
      setRealEstateId('')
      setTokenCopiado(false)

      // Recargar todos los tokens para mantener sincronización
      setTimeout(() => {
        cargarTokens()
      }, 1000)

    } catch (error) {
      console.error('Error al generar token:', error)
      setError(error.message || 'Error al generar el token')
    } finally {
      setIsGenerating(false)
    }
  }

  // Función para copiar token
  const copiarToken = async (token) => {
    try {
      await navigator.clipboard.writeText(token)
      setTokenCopiado(true)
      setTimeout(() => setTokenCopiado(false), 2000)
    } catch (error) {
      console.error('Error al copiar token:', error)
      // Fallback para navegadores que no soportan la API de clipboard
      const textArea = document.createElement('textarea')
      textArea.value = token
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setTokenCopiado(true)
      setTimeout(() => setTokenCopiado(false), 2000)
    }
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
    if (!fecha || !(fecha instanceof Date) || isNaN(fecha)) {
      return 'Fecha inválida'
    }
    
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
    if (!fechaExpiracion || !(fechaExpiracion instanceof Date)) {
      return false
    }
    return new Date() > fechaExpiracion
  }

  // Cargar tokens al montar el componente
  useEffect(() => {
    cargarTokens()
  }, [])

  // Auto-refresh cada 30 segundos para mantener los datos actualizados
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading && !isGenerating) {
        cargarTokens()
      }
    }, 30000) // 30 segundos

    return () => clearInterval(interval)
  }, [isLoading, isGenerating])

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
            toggleMenu={() => { }}
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

            {/* Mostrar errores */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></div>
                  <span className="text-red-800 text-sm font-medium">Error</span>
                </div>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            )}

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
                      Correo del Agente
                    </label>
                    <input
                      type="email"
                      value={correoAgente}
                      onChange={(e) => setCorreoAgente(e.target.value)}
                      placeholder="Ej: agente@gmail.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                      disabled={isGenerating}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID de la inmobiliaria
                    </label>
                    <input
                      type="number"
                      value={realEstateId}
                      onChange={e => setRealEstateId(e.target.value)}
                      placeholder="Ej: 42"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                      disabled={isGenerating}
                    />
                  </div>

                  <button
                    onClick={handleGenerarToken}
                    disabled={isGenerating || !correoAgente.trim() || !realEstateId.trim()}
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
                            <CheckCircle className="w-5 h-5 text-cyan-500" />
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={cargarTokens}
                    disabled={isLoading}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Actualizar lista"
                  >
                    <RefreshCw className={`w-4 h-4 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                    {tokensGenerados.length} tokens
                  </span>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-500">Cargando tokens...</p>
                </div>
              ) : tokensGenerados.length === 0 ? (
                <div className="text-center py-12">
                  <Key className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No hay tokens generados aún</p>
                  <p className="text-sm text-gray-400">Genera tu primer token para comenzar</p>
                </div>
              ) : (
                <div className="space-y-4 overflow-x-auto">
                  {tokensGenerados.map((tokenObj) => (
                    <div key={tokenObj.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow min-w-0">
                      <div className="flex flex-col gap-4">
                        {/* Header con correo y estado */}
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">{tokenObj.correoAgente}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${tokenObj.usado
                              ? 'bg-indigo-100 text-indigo-700'
                              : isTokenExpirado(tokenObj.fechaExpiracion)
                                ? 'bg-red-100 text-red-700'
                                : 'bg-blue-100 text-blue-700'
                              }`}>
                              {tokenObj.usado ? 'Usado' : isTokenExpirado(tokenObj.fechaExpiracion) ? 'Expirado' : 'Activo'}
                            </span>
                          </div>
                          <button
                            onClick={() => copiarToken(tokenObj.token)}
                            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm whitespace-nowrap"
                          >
                            <Copy className="w-4 h-4" />
                            Copiar
                          </button>
                        </div>

                        {/* Token - Con scroll horizontal si es necesario */}
                        <div className="bg-gray-50 rounded-lg p-3 overflow-x-auto">
                          <code className="font-mono text-sm text-gray-700 whitespace-nowrap block">
                            {tokenObj.token}
                          </code>
                        </div>

                        {/* Fechas */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 flex-shrink-0" />
                            <span className="whitespace-nowrap">Creado: {formatearFecha(tokenObj.fechaCreacion)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 flex-shrink-0" />
                            <span className="whitespace-nowrap">Expira: {formatearFecha(tokenObj.fechaExpiracion)}</span>
                          </div>
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