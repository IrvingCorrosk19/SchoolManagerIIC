import React, { useState } from 'react';
import { User, Search, AlertCircle } from 'lucide-react';

type ParentLoginProps = {
  onLogin: (studentId: number) => void;
};

export function ParentLogin({ onLogin }: ParentLoginProps) {
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Lista de IDs de estudiantes válidos para el demo
  const validStudentIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simular retraso de API
    setTimeout(() => {
      if (validStudentIds.includes(studentId)) {
        onLogin(parseInt(studentId));
      } else {
        setError('ID de estudiante no encontrado');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full">
      <div className="p-4 bg-green-600 text-white">
        <h1 className="text-2xl font-bold">Portal para Padres</h1>
        <p className="text-green-100">Consulta de calificaciones y asistencia de su hijo/a</p>
      </div>
      
      <div className="p-8 flex justify-center">
        <div className="w-full max-w-md">
          <div className="bg-green-50 p-6 rounded-xl mb-6">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <User size={40} className="text-green-600" />
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mb-6 text-center">Acceso al Portal</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 flex items-start">
                <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleLogin}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID del Estudiante
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ingrese el ID del estudiante"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-green-600 text-white p-3 rounded-lg flex items-center justify-center gap-2 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Buscando...</span>
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    <span>Consultar Información</span>
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-4 text-center text-sm text-gray-600">
              <p>Para acceder al demo, use cualquiera de estos IDs:</p>
              <p className="font-medium">1, 2, 3, 4, 5, 6, 7, 8, 9, 10</p>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-600">
            <p>Este portal permite a los padres consultar la información académica de sus hijos.</p>
            <p>Si no conoce el ID de su hijo/a, contacte a la administración de la escuela.</p>
          </div>
        </div>
      </div>
    </div>
  );
}