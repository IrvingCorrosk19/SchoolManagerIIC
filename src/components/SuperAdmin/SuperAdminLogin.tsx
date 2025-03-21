import React, { useState } from 'react';
import {  Lock, User, LogIn, AlertCircle, Shield } from 'lucide-react';


type SuperAdminLoginProps = {
  onLogin: (success: boolean) => void;
};

export function SuperAdminLogin({ onLogin }: SuperAdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  


  const handleFirstStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // For demo purposes, we'll simulate this behavior
      if (email === 'superadmin@sistema.edu' && password === 'Admin123!') {
        setShowTwoFactor(true);
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // For demo purposes, we'll accept a simple code
      if (twoFactorCode === '123456') {
        // Instead of using Firebase Auth, we'll just call the onLogin callback
        onLogin(true);
      } else {
        setError('Código de verificación incorrecto');
      }
    } catch (err) {
      setError('Error al verificar el código');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full">
      <div className="p-4 bg-indigo-700 text-white">
        <h1 className="text-2xl font-bold">Super Administrador</h1>
        <p className="text-indigo-200">Gestión centralizada del sistema escolar</p>
      </div>
      
      <div className="p-8 flex justify-center">
        <div className="w-full max-w-md">
          <div className="bg-indigo-50 p-6 rounded-xl mb-6">
            <div className="flex justify-center mb-6">
              <div className="bg-indigo-100 p-4 rounded-full">
                <Shield size={40} className="text-indigo-700" />
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mb-6 text-center">
              {showTwoFactor ? 'Verificación en Dos Pasos' : 'Iniciar Sesión'}
            </h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 flex items-start">
                <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
            
            {!showTwoFactor ? (
              <form onSubmit={handleFirstStep}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="correo@ejemplo.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Contraseña"
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-indigo-700 text-white p-3 rounded-lg flex items-center justify-center gap-2 ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-800'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Verificando...</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={20} />
                      <span>Continuar</span>
                    </>
                  )}
                </button>
                <button
                      type="button"
                      onClick={() => window.location.reload()}
                      className="w-full bg-gray-600 text-white p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-700 mt-3"
                    >
                      <span>Regresar</span>
                    </button>

              </form>
            ) : (
              <form onSubmit={handleTwoFactorSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código de Verificación
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Shield size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Ingrese el código de 6 dígitos"
                      maxLength={6}
                      required
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Ingrese el código de verificación generado por su aplicación de autenticación.
                  </p>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-indigo-700 text-white p-3 rounded-lg flex items-center justify-center gap-2 ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-800'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Verificando...</span>
                    </>
                  ) : (
                    <>
                      <Shield size={20} />
                      <span>Verificar</span>
                    </>
                  )}
                </button>
                
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setShowTwoFactor(false)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm"
                  >
                    Volver al inicio de sesión
                  </button>
                </div>
              </form>
            )}
            
            <div className="mt-4 text-center text-sm text-gray-600">
              <p>Para acceder al demo, use:</p>
              <p className="font-medium">Email: superadmin@sistema.edu / Contraseña: Admin123!</p>
              {showTwoFactor && <p className="font-medium">Código 2FA: 123456</p>}
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-600">
            <p>Sistema de Gestión Escolar Centralizado</p>
            <p>Acceso exclusivo para administradores del sistema</p>
          </div>
        </div>
      </div>
    </div>
  );
}