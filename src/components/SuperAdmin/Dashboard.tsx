import { useState } from 'react';
import { Building2, Users, Shield, FileText, LogOut } from 'lucide-react';
import { SchoolManagement } from './SchoolManagement';
import { AccessManagement } from './AccessManagement';
import { SecuritySettings } from './SecuritySettings';
import { AuditLogs } from './AuditLogs';
import { useAuth } from '../../context/AuthContext';

export function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState<'schools' | 'access' | 'security' | 'audit'>('schools');
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex flex-col">
      {/* Header */}
      <header className="bg-indigo-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield size={24} className="text-indigo-300" />
            <h1 className="text-xl font-bold">Sistema de Gestión Escolar | Super Administrador</h1>
          </div>
          
          <button
            onClick={handleLogout}
            className="bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </header>
      
      <div className="container mx-auto p-4 flex-1 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-64 bg-white rounded-xl shadow-md p-4 h-fit">
          <nav>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('schools')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                    activeTab === 'schools' 
                      ? 'bg-indigo-100 text-indigo-800 font-medium' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Building2 size={20} />
                  <span>Gestión de Escuelas</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('access')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                    activeTab === 'access' 
                      ? 'bg-indigo-100 text-indigo-800 font-medium' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Users size={20} />
                  <span>Gestión de Accesos</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                    activeTab === 'security' 
                      ? 'bg-indigo-100 text-indigo-800 font-medium' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Shield size={20} />
                  <span>Configuración de Seguridad</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('audit')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                    activeTab === 'audit' 
                      ? 'bg-indigo-100 text-indigo-800 font-medium' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <FileText size={20} />
                  <span>Registros de Auditoría</span>
                </button>
              </li>
            </ul>
          </nav>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-indigo-50 p-3 rounded-lg">
              <h3 className="font-medium text-indigo-800 mb-1">Sistema Central</h3>
              <p className="text-xs text-indigo-600">
                Versión 1.0.0
              </p>
              <p className="text-xs text-indigo-600 mt-1">
                © 2025 Sistema de Gestión Escolar
              </p>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'schools' && <SchoolManagement />}
          {activeTab === 'access' && <AccessManagement />}
          {activeTab === 'security' && <SecuritySettings />}
          {activeTab === 'audit' && <AuditLogs />}
        </div>
      </div>
    </div>
  );
}