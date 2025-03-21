import React, { useState } from 'react';
import { TeacherPortal } from './components/TeacherPortal';
import { ParentPortal } from './components/ParentPortal';
import { AdminPortal } from './components/AdminPortal';
import { DirectorPortal } from './components/DirectorPortal';
import { AdminLogin } from './components/AdminLogin';
import { SuperAdminLogin } from './components/SuperAdmin/SuperAdminLogin';
import { SuperAdminDashboard } from './components/SuperAdmin/Dashboard';
import { useAuth } from './context/AuthContext';

function App() {
  const [activeTab, setActiveTab] = useState<'teacher' | 'parent' | 'admin' | 'director' | 'superadmin'>('teacher');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isSuperAdminLoggedIn, setIsSuperAdminLoggedIn] = useState(false);
  const { currentUser } = useAuth();

  const handleAdminLogin = (success: boolean) => {
    setIsAdminLoggedIn(success);
  };

  const handleSuperAdminLogin = (success: boolean) => {
    setIsSuperAdminLoggedIn(success);
  };

  // If user is logged in as super admin, show the super admin dashboard
  if (activeTab === 'superadmin') {
    if (isSuperAdminLoggedIn) {
      return <SuperAdminDashboard />;
    } else {
      return <SuperAdminLogin onLogin={handleSuperAdminLogin} />;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-emerald-100 flex flex-col items-center p-4">
      <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
        <div className="flex flex-wrap">
          <button 
            className={`px-6 py-3 font-medium ${activeTab === 'teacher' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('teacher')}
          >
            Portal del Docente
          </button>
          <button 
            className={`px-6 py-3 font-medium ${activeTab === 'parent' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('parent')}
          >
            Portal para Padres
          </button>
          <button 
            className={`px-6 py-3 font-medium ${activeTab === 'admin' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            onClick={() => {
              setActiveTab('admin');
              if (isAdminLoggedIn) {
                setIsAdminLoggedIn(false);
              }
            }}
          >
            Administrador
          </button>
          <button 
            className={`px-6 py-3 font-medium ${activeTab === 'director' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('director')}
          >
            Director
          </button>
          <button 
            className={`px-6 py-3 font-medium ${activeTab === 'superadmin' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('superadmin')}
          >
            Super Admin
          </button>
        </div>
      </div>

      <div className="w-full max-w-4xl">
        {activeTab === 'teacher' ? (
          <TeacherPortal />
        ) : activeTab === 'parent' ? (
          <ParentPortal />
        ) : activeTab === 'admin' ? (
          isAdminLoggedIn ? <AdminPortal /> : <AdminLogin onLogin={handleAdminLogin} />
        ) : (
          <DirectorPortal />
        )}
      </div>
    </div>
  );
}

export default App;