import React, { useState } from 'react';
import { Lock, User, LogIn, AlertCircle } from 'lucide-react';

type AdminLoginProps = {
  onLogin: (success: boolean) => void;
};

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // In a real application, this would be handled securely on the server
  // This is just for demonstration purposes
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    setTimeout(() => {
      // Simple validation - in a real app, this would be a server request
      if (username === 'admin' && password === 'admin123') {
        onLogin(true);
      } else {
        setError('Usuario o contraseña incorrectos');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full">
      <div className="p-4 bg-blue-600 text-white">
        <h1 className="text-2xl font-bold">Acceso al Portal del Administrador</h1>
        <p className="text-blue-100">Ingrese sus credenciales para continuar</p>
      </div>
      
      <div className="p-8 flex justify-center">
        <div className="w-full max-w-md">
          <div className="bg-blue-50 p-6 rounded-xl mb-6">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-100 p-4 rounded-full">
                <Lock size={40} className="text-blue-600" />
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mb-6 text-center">Iniciar Sesión</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 flex items-start">
                <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuario
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre de usuario"
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
                    className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Contraseña"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center gap-2 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
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
                    <span>Iniciar Sesión</span>
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-4 text-center text-sm text-gray-600">
              <p>Para acceder al demo, use:</p>
              <p className="font-medium">Usuario: admin / Contraseña: admin123</p>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-600">
            <p>Este es un sistema de acceso seguro.</p>
            <p>Si olvidó sus credenciales, contacte al administrador del sistema.</p>
          </div>
        </div>
      </div>
    </div>
  );
}