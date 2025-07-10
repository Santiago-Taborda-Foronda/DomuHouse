import React, { useState } from 'react';
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import logoDomuHouse from '../../../assets/images/Logo-DomuHouse.png';
import LogoLogin from '../../../assets/images/imagen-login.png';

const URL = "http://localhost:10101/login/login";

export const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('🚀 Iniciando proceso de login con credenciales:', credentials);

    try {
      console.log('📡 Enviando petición a:', URL);
      const response = await fetch(URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      console.log('📡 Status de respuesta HTTP:', response.status);
      console.log('📡 Response OK:', response.ok);
      console.log('📡 Headers de respuesta:', Object.fromEntries(response.headers.entries()));

      // Verificar si la respuesta HTTP es exitosa
      if (!response.ok) {
        console.log('💥 Error HTTP detectado:', response.status);
        throw new Error(`Error HTTP: ${response.status}`);
      }

      // Obtener el texto de la respuesta primero para depurar
      const responseText = await response.text();
      console.log('📝 Respuesta como texto:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('💥 Error parseando JSON:', parseError);
        console.log('📝 Texto que no se pudo parsear:', responseText);
        throw new Error('Respuesta del servidor no es JSON válido');
      }

      console.log('📥 Respuesta del servidor (FRONTEND):', data);
      console.log('🧪 Token recibido desde backend:', data.token);
      console.log('📥 Tipo de data.logged:', typeof data.logged);
      console.log('📥 Valor de data.logged:', data.logged);
      console.log('📥 data.logged === true?', data.logged === true);
      console.log('📥 data.logged == true?', data.logged == true);

      // Verificar si el login fue exitoso - estructura real del backend
      if (data.status === 'success' && data.user) {
        console.log('✅ ENTRANDO EN IF - Login exitoso detectado');
        console.log('👤 Datos del usuario:', data.user);
        
        // Validar que existan los campos esperados en data.user
        if (!data.user.id || !data.user.name_person || !data.user.email || data.user.role_id === undefined) {
          console.error('💥 Datos incompletos:', data.user);
          throw new Error('Datos incompletos del usuario.');
        }

        const userData = {
          id: data.user.id,
          name_person: data.user.name_person,
          email: data.user.email,
          avatar: data.user.avatar || null,
          role_id: parseInt(data.user.role_id, 10),
          token: data.token // Guardamos también el token JWT
        };

        console.log('💾 Guardando userData:', userData);

        // Guardar datos en localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('authToken', data.token); // Guardar token por separado
        if (userData.role_id === 1) {
            localStorage.setItem('adminId', userData.id); // ✅ Agrega esta línea
          }
        localStorage.setItem('token', data.token) // 🔑 Este es el que espera el componente Perfil

        window.dispatchEvent(new Event('storage'));

        console.log('🎯 Redirigiendo usuario con role_id:', userData.role_id);

        // Redireccionar según el rol
        switch (userData.role_id) {
          case 1:
            console.log('🔄 Redirigiendo a AdminDashboard');
            navigate('/mi-inmobiliaria/propiedades');
            break;
          case 2:
            console.log('🔄 Redirigiendo a AgentDashboard (Agente)');
            navigate('/AgentDashboard');
            break;
          case 3:
            console.log('🔄 Redirigiendo a Home (Usuario)');
            navigate('/');
            break;
          default:
          setError('Rol de usuario no reconocido');
          break;
        }

      } else {
        // Si el backend responde con error
        console.log('❌ ENTRANDO EN ELSE - Login fallido');
        console.log('❌ data.status:', data.status);
        console.log('❌ data.message:', data.message);
        console.log('❌ Objeto completo:', JSON.stringify(data, null, 2));
        setError(data.message || 'Error en el inicio de sesión');
      }

    } catch (err) {
      console.error('💥 Error durante el login:', err);
      console.error('💥 Stack trace:', err.stack);
      
      // Manejar diferentes tipos de errores
      if (err.message.includes('HTTP')) {
        setError('Error de conexión con el servidor.');
      } else if (err.message.includes('JSON')) {
        setError('Error en la respuesta del servidor.');
      } else if (err.message.includes('fetch')) {
        setError('No se pudo conectar al servidor. Verifica tu conexión.');
      } else {
        setError('Error inesperado. Inténtalo nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col justify-around px-20 pr-30 w-full space-y-10 items-start'>
      <header className='flex items-center justify-start'>
        <img src={logoDomuHouse} alt="Logo DomuHouse" className='w-30' />
        <h1 className='text-sky-500 ml-5'>DOMU<span className='text-black'>HOUSE</span></h1>
      </header>

      <section className='flex items-center gap-20 w-full'>
        <div className='flex flex-col items-center shadow-lg border-1 border-gray-100 p-10 rounded-3xl min-w-110 space-y-5'>
          <p className='text-2xl'>Login</p>

          {error && (
            <div className="w-full p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='flex flex-col space-y-3 w-full'>
            <input
              className='p-3 border-gray-400 hover:border-gray-600 focus:outline-none focus:border-sky-500 border-2 rounded-lg w-full'
              placeholder='✉ Ingrese su correo'
              type='email'
              id='email'
              name='email'
              value={credentials.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />

            <div className='relative'>
              <input
                className='p-3 border-gray-400 hover:border-gray-600 focus:outline-none focus:border-sky-500 border-2 rounded-lg w-full'
                placeholder='🔒 Ingrese su contraseña'
                type={showPassword ? "text" : "password"}
                id='password'
                name='password'
                value={credentials.password}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`bg-sky-500 text-white p-3 w-full rounded-2xl transition-colors ${
                isLoading 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-sky-600 active:bg-sky-700'
              }`}
            >
              {isLoading ? 'Iniciando sesión...' : 'Entrar'}
            </button>
          </form>

          <div className='flex items-start mt-2'>
            <a 
              href="/recuperar-password" 
              className='text-sm text-sky-500 underline hover:text-sky-700'
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <span>
            ¿Aún no tienes una cuenta? 
            <a 
              href="/Registrarse" 
              className='ml-4 text-sm text-sky-500 underline hover:text-sky-700'
            >
              Regístrate
            </a>
          </span>
        </div>

        <div>
          <img src={LogoLogin} alt="Imagen de login" className='w-150' />
        </div>
      </section>
    </div>
  );
};