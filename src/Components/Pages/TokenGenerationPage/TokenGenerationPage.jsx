import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, Send, Clock, Shield, User, Mail, Home } from 'lucide-react';

const TokenGenerationPage = () => {
  const [loading, setLoading] = useState(false);
  const [tokenData, setTokenData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    agentEmail: '',
    expirationDays: 7,
    permissions: ['view_properties', 'manage_clients'],
    notes: ''
  });

  const permissionOptions = [
    { value: 'view_properties', label: 'Ver propiedades', description: 'Puede ver todas las propiedades' },
    { value: 'manage_clients', label: 'Gestionar clientes', description: 'Puede agregar y editar clientes' },
    { value: 'create_properties', label: 'Crear propiedades', description: 'Puede agregar nuevas propiedades' },
    { value: 'manage_appointments', label: 'Gestionar citas', description: 'Puede programar y gestionar citas' }
  ];

  const expirationOptions = [
    { value: 1, label: '1 día' },
    { value: 3, label: '3 días' },
    { value: 7, label: '1 semana' },
    { value: 14, label: '2 semanas' },
    { value: 30, label: '1 mes' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePermissionToggle = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const generateToken = async () => {
    setLoading(true);
    
    try {
      // Simulación de token - aquí conectarás con tu backend
      const simulatedToken = `AGT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + formData.expirationDays);
      
      const data = {
        token: simulatedToken,
        expirationDate: expirationDate.toISOString(),
        agentEmail: formData.agentEmail,
        permissions: formData.permissions,
        registrationUrl: `https://tuapp.com/register/agent?token=${simulatedToken}`
      };
      
      setTokenData(data);
      
    } catch (error) {
      console.error('Error al generar token:', error);
      alert('Error al generar el token. Intenta nuevamente.');
    }
    
    setLoading(false);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error al copiar:', error);
    }
  };

  const sendTokenByEmail = async () => {
    if (!tokenData || !formData.agentEmail) return;
    // Aquí conectarás con tu backend para enviar email
    alert('Invitación enviada por correo exitosamente');
  };

  const goBack = () => {
    // Aquí puedes usar navigate(-1) o redirigir a la página de gestión de agentes
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={goBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#2F8EAC] rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Invitar Nuevo Agente</h1>
                <p className="text-sm text-gray-500">Genera un token de invitación para un nuevo agente</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-8">
            {!tokenData ? (
              // Formulario de generación
              <div className="space-y-8">
                
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Home className="w-4 h-4" />
                  <span>Gestión de Agentes</span>
                  <span>/</span>
                  <span className="text-[#2F8EAC] font-medium">Invitar Agente</span>
                </div>

                {/* Email del agente */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email del agente (opcional)
                  </label>
                  <input
                    type="email"
                    placeholder="agente@email.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                    value={formData.agentEmail}
                    onChange={(e) => handleInputChange('agentEmail', e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Si proporcionas un email, podrás enviar la invitación directamente por correo
                  </p>
                </div>

                {/* Tiempo de expiración */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Tiempo de expiración del token
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                    value={formData.expirationDays}
                    onChange={(e) => handleInputChange('expirationDays', parseInt(e.target.value))}
                  >
                    {expirationOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Permisos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    <User className="w-4 h-4 inline mr-2" />
                    Permisos del agente
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {permissionOptions.map(permission => (
                      <div key={permission.value} className="border border-gray-200 rounded-xl p-4 hover:border-[#2F8EAC] transition-colors">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            id={permission.value}
                            checked={formData.permissions.includes(permission.value)}
                            onChange={() => handlePermissionToggle(permission.value)}
                            className="mt-1 w-4 h-4 text-[#2F8EAC] border-gray-300 rounded focus:ring-[#2F8EAC]"
                          />
                          <div className="flex-1">
                            <label htmlFor={permission.value} className="text-sm font-medium text-gray-700 cursor-pointer">
                              {permission.label}
                            </label>
                            <p className="text-xs text-gray-500 mt-1">{permission.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Notas adicionales (opcional)
                  </label>
                  <textarea
                    placeholder="Información adicional sobre el agente..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors resize-none"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                  />
                </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                  <button
                    onClick={goBack}
                    className="px-8 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={generateToken}
                    disabled={loading}
                    className="px-8 py-3 bg-[#2F8EAC] text-white rounded-xl hover:bg-[#267a95] transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    {loading ? 'Generando...' : 'Generar Token de Invitación'}
                  </button>
                </div>
              </div>
            ) : (
              // Resultado del token
              <div className="space-y-8">
                
                {/* Success message */}
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    ¡Token generado exitosamente!
                  </h2>
                  <p className="text-gray-600">
                    El token de invitación ha sido creado. Compártelo con el agente para que pueda registrarse.
                  </p>
                </div>

                {/* Token info */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Token de invitación</label>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-3 font-mono text-sm break-all">
                        {tokenData.token}
                      </div>
                      <button
                        onClick={() => copyToClipboard(tokenData.token)}
                        className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        title="Copiar token"
                      >
                        {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-gray-600" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">URL de registro</label>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm break-all">
                        {tokenData.registrationUrl}
                      </div>
                      <button
                        onClick={() => copyToClipboard(tokenData.registrationUrl)}
                        className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        title="Copiar URL"
                      >
                        <Copy className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="font-semibold text-blue-900 mb-3">Información del token</h3>
                    <div className="space-y-2 text-sm text-blue-800">
                      <p><strong>Expira:</strong> {new Date(tokenData.expirationDate).toLocaleDateString()}</p>
                      <p><strong>Permisos:</strong> {formData.permissions.length} permisos asignados</p>
                      {formData.agentEmail && <p><strong>Email destino:</strong> {formData.agentEmail}</p>}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                  {formData.agentEmail && (
                    <button
                      onClick={sendTokenByEmail}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                    >
                      <Send className="w-4 h-4" />
                      Enviar por Email
                    </button>
                  )}
                  <button
                    onClick={() => copyToClipboard(tokenData.registrationUrl)}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2F8EAC] text-white rounded-xl hover:bg-[#267a95] transition-colors font-medium"
                  >
                    <Copy className="w-4 h-4" />
                    Copiar URL de Registro
                  </button>
                  <button
                    onClick={goBack}
                    className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Volver a Gestión de Agentes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenGenerationPage;